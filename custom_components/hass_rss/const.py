"""Constants for the HASS RSS integration."""

import json
from pathlib import Path
from typing import Final

MANIFEST_PATH = Path(__file__).parent / "manifest.json"
with open(MANIFEST_PATH, encoding="utf-8") as manifest_file:
    INTEGRATION_VERSION: Final[str] = json.load(manifest_file).get("version", "1.0.0")

DOMAIN = "hass_rss"

URL_BASE: Final[str] = "/hass_rss_card"
CARD_FILENAME: Final[str] = "hass-rss-card.js"

CONF_NAME = "name"
CONF_URL = "url"
CONF_REFRESH_INTERVAL = "refresh_interval"
CONF_CATEGORY = "category"
CONF_MAX_ITEMS = "max_items"
CONF_ENABLE_NOTIFICATIONS = "enable_notifications"
CONF_NOTIFY_SERVICE = "notify_service"

DEFAULT_REFRESH_INTERVAL = 5
DEFAULT_MAX_ITEMS = 20
MIN_REFRESH_INTERVAL = 1
MAX_REFRESH_INTERVAL = 1440

SPEED_PRESETS = {
    "slow": 30,
    "medium": 50,
    "fast": 80,
}

PLATFORMS = ["sensor"]

DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; HASS-RSS/1.0; +https://github.com/hass-rss-card)"
    ),
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
}
