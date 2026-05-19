"""Register the bundled Lovelace card."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from homeassistant.components.http import StaticPathConfig
from homeassistant.components.lovelace.const import LOVELACE_DATA, MODE_STORAGE
from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_call_later

from ..const import CARD_FILENAME, INTEGRATION_VERSION, URL_BASE

_LOGGER = logging.getLogger(__name__)

_LEGACY_LOCAL_URL = "/local/hass-rss-card.js"
_RETRY_DELAY = 5


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

    lovelace_data = hass.data.get(LOVELACE_DATA)
    if not lovelace_data:
        _LOGGER.debug("Lovelace not ready yet, retrying HASS RSS card registration")
        async_call_later(
            hass,
            _RETRY_DELAY,
            lambda _now: hass.async_create_task(async_register_card(hass)),
        )
        return

    if lovelace_data.resource_mode != MODE_STORAGE:
        _LOGGER.debug(
            "Lovelace YAML mode: add %s/%s as a module resource manually",
            URL_BASE,
            CARD_FILENAME,
        )
        return

    async def _register_resource(_now: Any) -> None:
        resources = lovelace_data.resources
        if hasattr(resources, "_async_ensure_loaded"):
            await resources._async_ensure_loaded()

        card_url = f"{URL_BASE}/{CARD_FILENAME}?v={INTEGRATION_VERSION}"
        base_url = f"{URL_BASE}/{CARD_FILENAME}"
        rss_urls = {base_url, _LEGACY_LOCAL_URL}

        canonical_id: str | None = None
        for resource in list(resources.async_items()):
            url = resource.get("url", "")
            url_base = url.split("?")[0]
            if url_base not in rss_urls and "hass-rss-card.js" not in url:
                continue
            if url_base == base_url and canonical_id is None:
                canonical_id = resource["id"]
                continue
            await resources.async_delete_item(resource["id"])
            _LOGGER.info("Removed stale HASS RSS Card resource: %s", url)

        if canonical_id:
            await resources.async_update_item(
                canonical_id,
                {"res_type": "module", "url": card_url},
            )
            _LOGGER.info("Updated HASS RSS Card resource to %s", card_url)
            return

        await resources.async_create_item({"res_type": "module", "url": card_url})
        _LOGGER.info("Registered HASS RSS Card Lovelace resource")

    await _register_resource(0)
