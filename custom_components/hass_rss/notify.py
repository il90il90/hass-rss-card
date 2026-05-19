"""Optional notification handling for new RSS items."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant

from .const import CONF_ENABLE_NOTIFICATIONS, CONF_NAME, CONF_NOTIFY_SERVICE

_LOGGER = logging.getLogger(__name__)


async def maybe_notify_new_item(
    hass: HomeAssistant,
    config: dict[str, Any],
    coordinator_data: dict[str, Any],
    previous_guid: str | None,
) -> None:
    """Send a notification if a new item was detected."""
    if not config.get(CONF_ENABLE_NOTIFICATIONS):
        return

    notify_service = config.get(CONF_NOTIFY_SERVICE)
    if not notify_service:
        return

    current_guid = coordinator_data.get("guid")
    if not current_guid or current_guid == previous_guid:
        return

    if previous_guid is None:
        return

    feed_name = config.get(CONF_NAME, "RSS")
    title = coordinator_data.get("title", "New article")
    link = coordinator_data.get("link")

    parts = notify_service.split(".", 1)
    if len(parts) != 2:
        _LOGGER.warning("Invalid notify service: %s", notify_service)
        return

    domain, service = parts
    data: dict[str, Any] = {
        "title": f"RSS: {feed_name}",
        "message": title,
    }
    if link:
        data["data"] = {"url": link}

    try:
        await hass.services.async_call(domain, service, data, blocking=False)
    except Exception as err:  # noqa: BLE001
        _LOGGER.error("Failed to send notification: %s", err)
