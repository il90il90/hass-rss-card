"""Config flow for HASS RSS."""

from __future__ import annotations

import logging
from typing import Any

import aiohttp
import feedparser
import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import HomeAssistant, callback
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers import config_validation as cv

from .const import (
    CONF_CATEGORY,
    CONF_ENABLE_NOTIFICATIONS,
    CONF_MAX_ITEMS,
    CONF_NAME,
    CONF_NOTIFY_SERVICE,
    CONF_REFRESH_INTERVAL,
    CONF_URL,
    DEFAULT_HEADERS,
    DEFAULT_MAX_ITEMS,
    DEFAULT_REFRESH_INTERVAL,
    DOMAIN,
    MAX_REFRESH_INTERVAL,
    MIN_REFRESH_INTERVAL,
)
from .opml import parse_opml

_LOGGER = logging.getLogger(__name__)


async def _validate_feed(hass: HomeAssistant, url: str) -> None:
    from homeassistant.helpers.aiohttp_client import async_get_clientsession

    session = async_get_clientsession(hass)
    async with session.get(
        url, headers=DEFAULT_HEADERS, timeout=aiohttp.ClientTimeout(total=30)
    ) as response:
        if response.status >= 400:
            raise CannotConnect
        content = await response.text()

    parsed = await hass.async_add_executor_job(_parse_feed_content, content)
    if parsed.bozo and not parsed.entries:
        raise InvalidFeed


def _parse_feed_content(content: str):
    """Parse feed content in executor to avoid blocking the event loop."""
    return feedparser.parse(content)


class CannotConnect(Exception):
    """Error to indicate we cannot connect."""


class InvalidFeed(Exception):
    """Error to indicate the feed is invalid."""


class HassRssConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for HASS RSS."""

    VERSION = 1

    def __init__(self) -> None:
        self._opml_feeds: list[dict[str, str]] = []

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> HassRssOptionsFlow:
        return HassRssOptionsFlow()

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        if user_input is None:
            return self.async_show_menu(
                step_id="user",
                menu_options=["add_feed", "import_opml"],
            )
        return await getattr(self, f"async_step_{user_input}")()

    async def async_step_add_feed(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        errors: dict[str, str] = {}

        if user_input is not None:
            await self.async_set_unique_id(user_input[CONF_URL])
            self._abort_if_unique_id_configured()

            try:
                await _validate_feed(self.hass, user_input[CONF_URL])
            except CannotConnect:
                errors["base"] = "cannot_connect"
            except InvalidFeed:
                errors["base"] = "invalid_feed"
            except Exception:  # noqa: BLE001
                _LOGGER.exception("Unexpected error validating feed")
                errors["base"] = "unknown"
            else:
                if user_input.get(CONF_ENABLE_NOTIFICATIONS):
                    self.context["user_input"] = user_input
                    return await self.async_step_notifications()
                return self._create_entry(user_input)

        schema = vol.Schema(
            {
                vol.Required(CONF_NAME): str,
                vol.Required(CONF_URL): str,
                vol.Optional(
                    CONF_REFRESH_INTERVAL, default=DEFAULT_REFRESH_INTERVAL
                ): vol.All(
                    vol.Coerce(int),
                    vol.Range(
                        min=MIN_REFRESH_INTERVAL, max=MAX_REFRESH_INTERVAL
                    ),
                ),
                vol.Optional(CONF_CATEGORY, default=""): str,
                vol.Optional(CONF_MAX_ITEMS, default=DEFAULT_MAX_ITEMS): vol.All(
                    vol.Coerce(int), vol.Range(min=1, max=100)
                ),
                vol.Optional(CONF_ENABLE_NOTIFICATIONS, default=False): bool,
            }
        )

        return self.async_show_form(
            step_id="add_feed", data_schema=schema, errors=errors
        )

    async def async_step_import(self, import_data: dict[str, Any]) -> FlowResult:
        """Handle import from OPML."""
        await self.async_set_unique_id(import_data[CONF_URL])
        self._abort_if_unique_id_configured()
        return self._create_entry(import_data)

    async def async_step_notifications(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        base_input = self.context.get("user_input", {})
        if user_input is not None:
            merged = {**base_input, **user_input}
            return self._create_entry(merged)

        notify_services = self._get_notify_services()
        schema = vol.Schema(
            {
                vol.Required(CONF_NOTIFY_SERVICE): vol.In(notify_services),
            }
        )
        return self.async_show_form(step_id="notifications", data_schema=schema)

    async def async_step_import_opml(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        errors: dict[str, str] = {}

        if user_input is not None:
            try:
                self._opml_feeds = parse_opml(user_input["opml_content"])
            except ValueError:
                errors["base"] = "invalid_opml"
            else:
                return await self.async_step_opml_confirm()

        schema = vol.Schema({vol.Required("opml_content"): cv.string})
        return self.async_show_form(
            step_id="import_opml", data_schema=schema, errors=errors
        )

    async def async_step_opml_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        if user_input is not None:
            created = 0
            skipped = 0
            existing = {
                entry.unique_id
                for entry in self.hass.config_entries.async_entries(DOMAIN)
            }
            for feed in self._opml_feeds:
                if feed["url"] in existing:
                    skipped += 1
                    continue
                existing.add(feed["url"])
                self.hass.async_create_task(
                    self.hass.config_entries.flow.async_init(
                        DOMAIN,
                        context={"source": config_entries.SOURCE_IMPORT},
                        data={
                            CONF_NAME: feed["name"],
                            CONF_URL: feed["url"],
                            CONF_REFRESH_INTERVAL: DEFAULT_REFRESH_INTERVAL,
                            CONF_CATEGORY: "",
                            CONF_MAX_ITEMS: DEFAULT_MAX_ITEMS,
                            CONF_ENABLE_NOTIFICATIONS: False,
                            CONF_NOTIFY_SERVICE: "",
                        },
                    )
                )
                created += 1

            return self.async_abort(
                reason="opml_imported",
                description_placeholders={
                    "created": str(created),
                    "skipped": str(skipped),
                },
            )

        feed_list = "\n".join(
            f"- {f['name']}: {f['url']}" for f in self._opml_feeds[:20]
        )
        if len(self._opml_feeds) > 20:
            feed_list += f"\n... and {len(self._opml_feeds) - 20} more"

        return self.async_show_form(
            step_id="opml_confirm",
            description_placeholders={"feeds": feed_list},
            data_schema=vol.Schema({}),
        )

    def _create_entry(self, user_input: dict[str, Any]) -> FlowResult:
        if not user_input.get(CONF_ENABLE_NOTIFICATIONS):
            user_input[CONF_NOTIFY_SERVICE] = ""
        return self.async_create_entry(
            title=user_input[CONF_NAME],
            data=user_input,
        )

    def _get_notify_services(self) -> list[str]:
        services = []
        for entity_id in self.hass.states.async_entity_ids("notify"):
            domain, name = entity_id.split(".", 1)
            services.append(f"{domain}.{name}")
        if not services:
            services = ["notify.notify"]
        return services


class HassRssOptionsFlow(config_entries.OptionsFlow):
    """Handle options flow for HASS RSS."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        if user_input is not None:
            if not user_input.get(CONF_ENABLE_NOTIFICATIONS):
                user_input[CONF_NOTIFY_SERVICE] = ""
            return self.async_create_entry(title="", data=user_input)

        current = {**self.config_entry.data, **self.config_entry.options}

        schema = vol.Schema(
            {
                vol.Optional(
                    CONF_REFRESH_INTERVAL,
                    default=current.get(
                        CONF_REFRESH_INTERVAL, DEFAULT_REFRESH_INTERVAL
                    ),
                ): vol.All(
                    vol.Coerce(int),
                    vol.Range(
                        min=MIN_REFRESH_INTERVAL, max=MAX_REFRESH_INTERVAL
                    ),
                ),
                vol.Optional(
                    CONF_CATEGORY, default=current.get(CONF_CATEGORY, "")
                ): str,
                vol.Optional(
                    CONF_MAX_ITEMS,
                    default=current.get(CONF_MAX_ITEMS, DEFAULT_MAX_ITEMS),
                ): vol.All(vol.Coerce(int), vol.Range(min=1, max=100)),
                vol.Optional(
                    CONF_ENABLE_NOTIFICATIONS,
                    default=current.get(CONF_ENABLE_NOTIFICATIONS, False),
                ): bool,
                vol.Optional(
                    CONF_NOTIFY_SERVICE,
                    default=current.get(CONF_NOTIFY_SERVICE, ""),
                ): str,
            }
        )

        return self.async_show_form(step_id="init", data_schema=schema)
