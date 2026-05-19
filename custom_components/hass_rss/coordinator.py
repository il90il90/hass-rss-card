"""Data update coordinator for RSS feeds."""

from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timedelta, timezone
from typing import Any

import aiohttp
import feedparser
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .const import CONF_MAX_ITEMS, CONF_NAME, CONF_URL, DEFAULT_HEADERS, DEFAULT_MAX_ITEMS
from .parser import parse_entry

_LOGGER = logging.getLogger(__name__)


class HassRssCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    """Coordinator that polls an RSS feed."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry_id: str,
        config: dict[str, Any],
        update_interval: timedelta,
    ) -> None:
        self.entry_id = entry_id
        self.feed_name = config[CONF_NAME]
        self.feed_url = config[CONF_URL]
        self.max_items = config.get(CONF_MAX_ITEMS, DEFAULT_MAX_ITEMS)
        self._etag: str | None = None
        self._modified: str | None = None
        self._last_guid: str | None = None
        self.last_error: str | None = None
        self.config = config

        super().__init__(
            hass,
            _LOGGER,
            name=f"HASS RSS {self.feed_name}",
            update_interval=update_interval,
        )

    async def _async_update_data(self) -> dict[str, Any]:
        session = async_get_clientsession(self.hass)
        headers: dict[str, str] = dict(DEFAULT_HEADERS)
        if self._etag:
            headers["If-None-Match"] = self._etag
        if self._modified:
            headers["If-Modified-Since"] = self._modified

        try:
            async with asyncio.timeout(30):
                async with session.get(self.feed_url, headers=headers) as response:
                    if response.status == 304:
                        if self.data:
                            return {
                                **self.data,
                                "last_success": dt_util.utcnow().isoformat(),
                            }
                        raise UpdateFailed("Feed not modified but no cached data")

                    if response.status >= 400:
                        raise UpdateFailed(f"HTTP {response.status}")

                    content = await response.text()
                    self._etag = response.headers.get("ETag")
                    self._modified = response.headers.get("Last-Modified")
        except TimeoutError as err:
            self.last_error = "Timeout fetching feed"
            raise UpdateFailed(self.last_error) from err
        except aiohttp.ClientError as err:
            self.last_error = f"Connection error: {err}"
            raise UpdateFailed(self.last_error) from err

        try:
            result = await self.hass.async_add_executor_job(self._parse_feed, content)
        except UpdateFailed as err:
            self.last_error = str(err)
            raise
        self.last_error = None
        return result

    def _parse_feed(self, content: str) -> dict[str, Any]:
        parsed = feedparser.parse(content)
        if parsed.bozo and not parsed.entries:
            raise UpdateFailed(f"Invalid feed: {parsed.bozo_exception}")

        items = []
        for entry in parsed.entries[: self.max_items]:
            items.append(parse_entry(entry, self.feed_url))

        latest = items[0] if items else None
        now = dt_util.utcnow().isoformat()

        return {
            "feed_name": self.feed_name,
            "title": latest["title"] if latest else "No items",
            "link": latest["link"] if latest else None,
            "published": latest["published"] if latest else None,
            "summary": latest["summary"] if latest else None,
            "image": latest["image"] if latest else None,
            "has_image": latest["has_image"] if latest else False,
            "guid": latest["guid"] if latest else None,
            "items": items,
            "item_count": len(items),
            "last_success": now,
            "last_error": None,
        }

    @property
    def last_guid(self) -> str | None:
        return self._last_guid

    def set_last_guid(self, guid: str | None) -> None:
        self._last_guid = guid

    def set_error(self, error: str) -> None:
        if self.data:
            self.data["last_error"] = error
