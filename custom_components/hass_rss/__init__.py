"""The HASS RSS integration."""

from __future__ import annotations

import logging
from datetime import timedelta
from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.helpers import config_validation as cv, entity_registry as er

from .const import (
    CONF_ENABLE_NOTIFICATIONS,
    CONF_NAME,
    CONF_NOTIFY_SERVICE,
    CONF_REFRESH_INTERVAL,
    DEFAULT_REFRESH_INTERVAL,
    DOMAIN,
    PLATFORMS,
)
from .coordinator import HassRssCoordinator
from .notify import maybe_notify_new_item

_LOGGER = logging.getLogger(__name__)

SERVICE_REFRESH_FEED = "refresh_feed"
SERVICE_REFRESH_ALL = "refresh_all"

SERVICE_REFRESH_FEED_SCHEMA = vol.Schema(
    {
        vol.Optional("entry_id"): cv.string,
        vol.Optional("entity_id"): cv.entity_id,
    }
)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up HASS RSS from a config entry."""
    config = _get_merged_config(entry)
    interval = timedelta(
        minutes=config.get(CONF_REFRESH_INTERVAL, DEFAULT_REFRESH_INTERVAL)
    )

    coordinator = HassRssCoordinator(hass, entry.entry_id, config, interval)

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = {
        "coordinator": coordinator,
        "config": config,
    }

    @callback
    def _on_coordinator_update() -> None:
        hass.async_create_task(_handle_update(hass, entry, coordinator, config))

    coordinator.async_add_listener(_on_coordinator_update)

    await coordinator.async_config_entry_first_refresh()

    if coordinator.data and coordinator.data.get("guid"):
        coordinator.set_last_guid(coordinator.data["guid"])

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    entry.async_on_unload(entry.add_update_listener(_async_update_listener))

    return True


async def _handle_update(
    hass: HomeAssistant,
    entry: ConfigEntry,
    coordinator: HassRssCoordinator,
    config: dict[str, Any],
) -> None:
    if not coordinator.data:
        return

    previous_guid = coordinator.last_guid
    current_guid = coordinator.data.get("guid")

    if current_guid and current_guid != previous_guid:
        await maybe_notify_new_item(hass, config, coordinator.data, previous_guid)
        coordinator.set_last_guid(current_guid)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    if unload_ok := await hass.config_entries.async_unload_platforms(
        entry, PLATFORMS
    ):
        hass.data[DOMAIN].pop(entry.entry_id, None)
    return unload_ok


@callback
def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update."""
    hass.async_create_task(hass.config_entries.async_reload(entry.entry_id))


def _get_merged_config(entry: ConfigEntry) -> dict[str, Any]:
    return {**entry.data, **entry.options}


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up HASS RSS services."""

    async def refresh_feed(call: ServiceCall) -> None:
        entry_id = call.data.get("entry_id")
        entity_id = call.data.get("entity_id")

        if entity_id and not entry_id:
            registry = er.async_get(hass)
            entity = registry.async_get(entity_id)
            if entity and entity.config_entry_id:
                entry_id = entity.config_entry_id

        if entry_id and entry_id in hass.data.get(DOMAIN, {}):
            await hass.data[DOMAIN][entry_id]["coordinator"].async_request_refresh()
            return

        if entity_id:
            for eid, data in hass.data.get(DOMAIN, {}).items():
                coord = data["coordinator"]
                sensor_name = data["config"].get(CONF_NAME)
                state = hass.states.get(entity_id)
                if state and state.attributes.get("feed_name") == sensor_name:
                    await coord.async_request_refresh()
                    return

    async def refresh_all(_call: ServiceCall) -> None:
        for data in hass.data.get(DOMAIN, {}).values():
            await data["coordinator"].async_request_refresh()

    hass.services.async_register(
        DOMAIN,
        SERVICE_REFRESH_FEED,
        refresh_feed,
        schema=SERVICE_REFRESH_FEED_SCHEMA,
    )
    hass.services.async_register(DOMAIN, SERVICE_REFRESH_ALL, refresh_all)

    return True
