"""Diagnostics support for HASS RSS."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import CONF_URL, DOMAIN


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for a config entry."""
    entry_data = hass.data.get(DOMAIN, {}).get(entry.entry_id, {})
    coordinator = entry_data.get("coordinator")
    data = coordinator.data if coordinator else {}

    url = entry.data.get(CONF_URL, "")
    redacted_url = _redact_url(url)

    return {
        "entry_id": entry.entry_id,
        "feed_url": redacted_url,
        "refresh_interval": entry.data.get("refresh_interval"),
        "category": entry.data.get("category"),
        "max_items": entry.data.get("max_items"),
        "enable_notifications": entry.data.get("enable_notifications"),
        "last_success": data.get("last_success"),
        "last_error": data.get("last_error"),
        "item_count": data.get("item_count"),
    }


def _redact_url(url: str) -> str:
    """Redact query parameters that may contain tokens."""
    if "?" not in url:
        return url
    base, _ = url.split("?", 1)
    return f"{base}?***"
