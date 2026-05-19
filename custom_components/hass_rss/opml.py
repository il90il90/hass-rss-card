"""OPML import utilities."""

from __future__ import annotations

import xml.etree.ElementTree as ET
from typing import Any


def parse_opml(content: str) -> list[dict[str, str]]:
    """Parse OPML content and return a list of feed dicts with name and url."""
    try:
        root = ET.fromstring(content)
    except ET.ParseError as err:
        raise ValueError("Invalid OPML XML") from err

    feeds: list[dict[str, str]] = []
    seen_urls: set[str] = set()

    for outline in root.iter("outline"):
        xml_url = outline.get("xmlUrl") or outline.get("xmlurl")
        if not xml_url:
            continue
        if xml_url in seen_urls:
            continue
        seen_urls.add(xml_url)
        title = outline.get("title") or outline.get("text") or xml_url
        feeds.append({"name": title, "url": xml_url})

    if not feeds:
        raise ValueError("No feeds found in OPML file")

    return feeds
