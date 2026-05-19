"""Sensor platform for HASS RSS."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import CONF_CATEGORY, CONF_NAME, DOMAIN
from .coordinator import HassRssCoordinator


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator: HassRssCoordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]
    async_add_entities([HassRssSensor(coordinator, entry)])


class HassRssSensor(CoordinatorEntity[HassRssCoordinator], SensorEntity):
    """Sensor representing the latest RSS feed item."""

    _attr_has_entity_name = True
    _attr_icon = "mdi:rss"

    def __init__(self, coordinator: HassRssCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator)
        self._entry = entry
        self._attr_unique_id = entry.entry_id
        self._attr_name = None
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name=entry.data.get(CONF_NAME, "RSS Feed"),
            manufacturer="HASS RSS",
            model="RSS Feed",
            entry_type="service",
        )

    @property
    def native_value(self) -> str | None:
        if not self.coordinator.data:
            return None
        return self.coordinator.data.get("title")

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        if not self.coordinator.data:
            return {
                "feed_name": self._entry.data.get(CONF_NAME),
                "category": self._entry.data.get(CONF_CATEGORY),
                "last_error": "No data yet",
            }

        data = self.coordinator.data
        return {
            "link": data.get("link"),
            "published": data.get("published"),
            "summary": data.get("summary"),
            "image": data.get("image"),
            "has_image": data.get("has_image", False),
            "feed_name": data.get("feed_name"),
            "category": self._entry.data.get(CONF_CATEGORY),
            "items": data.get("items", []),
            "item_count": data.get("item_count", 0),
            "last_success": data.get("last_success"),
            "last_error": data.get("last_error") or self.coordinator.last_error,
        }
