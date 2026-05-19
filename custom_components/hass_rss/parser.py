"""RSS feed parsing utilities."""

from __future__ import annotations

import calendar
import re
from datetime import datetime, timezone
from html import unescape
from typing import Any
from urllib.parse import urljoin, urlparse

_IMG_RE = re.compile(
    r"""<img[^>]+src=["']([^"']+)["']""",
    re.IGNORECASE,
)


def _is_valid_image_url(url: str | None) -> bool:
    if not url:
        return False
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        return False
    return True


def _extract_img_from_html(html: str | None, base_url: str) -> str | None:
    if not html:
        return None
    match = _IMG_RE.search(html)
    if not match:
        return None
    url = unescape(match.group(1).strip())
    if url.startswith("//"):
        url = f"https:{url}"
    elif url.startswith("/"):
        url = urljoin(base_url, url)
    return url if _is_valid_image_url(url) else None


def extract_item_image(entry: dict[str, Any], feed_url: str) -> str | None:
    """Extract the best available image URL from a feed entry."""
    media_content = entry.get("media_content") or []
    if not isinstance(media_content, list):
        media_content = [media_content]
    for media in media_content:
        if isinstance(media, dict):
            url = media.get("url") or media.get("href")
            media_type = media.get("type", "")
            if url and (media_type.startswith("image/") or "image" in media_type):
                if _is_valid_image_url(url):
                    return url

    media_thumbnail = entry.get("media_thumbnail") or []
    if not isinstance(media_thumbnail, list):
        media_thumbnail = [media_thumbnail]
    for thumb in media_thumbnail:
        if isinstance(thumb, dict):
            url = thumb.get("url")
            if _is_valid_image_url(url):
                return url

    enclosures = entry.get("enclosures") or []
    for enc in enclosures:
        enc_type = enc.get("type", "")
        url = enc.get("href") or enc.get("url")
        if url and enc_type.startswith("image/") and _is_valid_image_url(url):
            return url

    for field in ("content", "summary", "description"):
        value = entry.get(field)
        if isinstance(value, list) and value:
            value = value[0].get("value", "")
        if isinstance(value, str):
            img = _extract_img_from_html(value, feed_url)
            if img:
                return img

    itunes_image = entry.get("image") or entry.get("itunes_image")
    if isinstance(itunes_image, dict):
        url = itunes_image.get("href") or itunes_image.get("url")
    else:
        url = itunes_image
    if _is_valid_image_url(url):
        return url

    return None


def entry_published_iso(entry: dict[str, Any]) -> str:
    """Return the best available ISO publish date for a feed entry."""
    for field in ("published_parsed", "updated_parsed", "created_parsed"):
        parsed = entry.get(field)
        if parsed:
            try:
                return datetime.fromtimestamp(
                    calendar.timegm(parsed), tz=timezone.utc
                ).isoformat()
            except (ValueError, OverflowError, OSError):
                continue
    return entry.get("published") or entry.get("updated") or ""


def entry_published_timestamp(entry: dict[str, Any]) -> float:
    """Return a sortable timestamp for a feed entry."""
    for field in ("published_parsed", "updated_parsed", "created_parsed"):
        parsed = entry.get(field)
        if parsed:
            try:
                return float(calendar.timegm(parsed))
            except (ValueError, OverflowError, OSError):
                continue
    published = entry.get("published") or entry.get("updated") or ""
    if not published:
        return 0.0
    try:
        normalized = published.replace("Z", "+00:00")
        return datetime.fromisoformat(normalized).timestamp()
    except ValueError:
        return 0.0


def parse_entry(entry: dict[str, Any], feed_url: str) -> dict[str, Any]:
    """Normalize a feedparser entry into a dict for entity attributes."""
    title = entry.get("title", "Untitled")
    link = entry.get("link") or entry.get("id") or ""
    published = entry_published_iso(entry)

    summary_raw = entry.get("summary") or entry.get("description") or ""
    if isinstance(summary_raw, list):
        summary_raw = summary_raw[0].get("value", "") if summary_raw else ""
    summary = re.sub(r"<[^>]+>", "", str(summary_raw)).strip()
    if len(summary) > 500:
        summary = summary[:497] + "..."

    image = extract_item_image(entry, feed_url)

    return {
        "title": title,
        "link": link,
        "published": published,
        "summary": summary,
        "image": image,
        "has_image": image is not None,
        "guid": entry.get("id") or link,
    }
