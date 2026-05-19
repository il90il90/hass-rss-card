"""Register the bundled Lovelace card."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_call_later

from ..const import CARD_FILENAME, INTEGRATION_VERSION, URL_BASE

_LOGGER = logging.getLogger(__name__)


async def async_register_card(hass: HomeAssistant) -> None:
    """Serve the card JS and add a Lovelace resource when possible."""
    frontend_dir = Path(__path__[0])
    card_path = frontend_dir / CARD_FILENAME
    if not card_path.is_file():
        _LOGGER.warning("HASS RSS card file missing: %s", card_path)
        return

    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(URL_BASE, str(frontend_dir), False)]
        )
    except RuntimeError:
        _LOGGER.debug("HASS RSS card path already registered")

    lovelace = hass.data.get("lovelace")
    if not lovelace:
        return

    resource_mode = getattr(
        lovelace, "mode", getattr(lovelace, "resource_mode", "yaml")
    )
    if resource_mode != "storage":
        _LOGGER.debug(
            "Lovelace YAML mode: add %s/%s as a module resource manually",
            URL_BASE,
            CARD_FILENAME,
        )
        return

    async def _register_resource(_now: Any) -> None:
        resources = lovelace.resources
        if not resources.loaded:
            async_call_later(hass, 5, _register_resource)
            return

        card_url = f"{URL_BASE}/{CARD_FILENAME}?v={INTEGRATION_VERSION}"
        base_url = f"{URL_BASE}/{CARD_FILENAME}"

        for resource in resources.async_items():
            if resource.get("url", "").split("?")[0] == base_url:
                if INTEGRATION_VERSION not in resource.get("url", ""):
                    await resources.async_update_item(
                        resource["id"],
                        {"res_type": "module", "url": card_url},
                    )
                return

        await resources.async_create_item({"res_type": "module", "url": card_url})
        _LOGGER.info("Registered HASS RSS Card Lovelace resource")

    await _register_resource(0)
