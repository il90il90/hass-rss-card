"""Strict static checks for hass-rss-card preset layouts and timestamps."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src" / "hass-rss-card.ts"
BUILT = ROOT / "custom_components" / "hass_rss" / "frontend" / "hass-rss-card.js"
PRESET_UTIL = ROOT / "src" / "utils" / "preset-display.ts"


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


def assert_contains(text: str, needle: str, label: str) -> None:
    if needle not in text:
        fail(f"{label}: missing '{needle}'")


def assert_regex(text: str, pattern: str, label: str) -> None:
    if not re.search(pattern, text, re.MULTILINE | re.DOTALL):
        fail(f"{label}: pattern not found: {pattern}")


def main() -> None:
    if not SRC.is_file():
        fail(f"Source not found: {SRC}")
    if not BUILT.is_file():
        fail(f"Built card not found: {BUILT}. Run npm run build first.")
    if not PRESET_UTIL.is_file():
        fail(f"Preset util not found: {PRESET_UTIL}")

    source = SRC.read_text(encoding="utf-8")
    built = BUILT.read_text(encoding="utf-8")
    preset_util = PRESET_UTIL.read_text(encoding="utf-8")

    presets = ("ticker", "list", "card", "magazine")
    for preset in presets:
        assert_contains(source, f"case '{preset}':", f"preset switch ({preset})")
        assert_contains(built, preset, f"built bundle mentions preset '{preset}'")
    assert_contains(source, "_renderCompact", "compact preset renderer")
    assert_contains(built, "compact-item", "compact layout in bundle")

    layout_markers = {
        "compact": "compact-item",
        "ticker": "ticker-wrap",
        "list": "list-items",
        "card": "card-item",
        "magazine": "magazine-item",
    }
    for preset, marker in layout_markers.items():
        assert_contains(source, marker, f"layout marker for {preset}")
        assert_contains(built, marker, f"built layout marker for {preset}")

    assert_contains(source, "last-updated", "feed last updated row")
    assert_contains(source, "_renderLastUpdated", "last updated renderer")
    assert_contains(source, "_renderRelativeTime", "article published renderer")
    assert_contains(built, "last-updated", "built last updated class")

    render_methods = (
        "_renderCompactItem",
        "_renderTicker",
        "_renderList",
        "_renderCard",
        "_renderMagazine",
    )
    for method in render_methods:
        assert_contains(source, method, f"render method {method}")

    assert_regex(
        source,
        r"_renderList\([\s\S]*?_renderRelativeTime\(item\.published\)",
        "list preset shows article time",
    )
    assert_regex(
        source,
        r"_renderCard\([\s\S]*?_renderRelativeTime\(item\.published\)",
        "card preset shows article time",
    )
    assert_regex(
        source,
        r"_renderMagazine\([\s\S]*?_renderRelativeTime\(item\.published\)",
        "magazine preset shows article time",
    )
    assert_regex(
        source,
        r"_renderTicker\([\s\S]*?_renderRelativeTime\(item\.published\)",
        "ticker preset shows article time",
    )
    assert_regex(
        source,
        r"_renderCompactItem\([\s\S]*?_renderRelativeTime\(item\.published\)",
        "compact preset shows article time",
    )

    assert_contains(source, "resolvePresetDisplay", "preset display resolver")
    for preset in ("card", "list", "magazine"):
        assert_contains(preset_util, f"{preset}:", f"preset defaults for {preset}")

    assert_contains(source, "preset-${preset}", "preset CSS class on ha-card")
    assert_contains(built, "preset-", "built preset CSS class prefix")

    assert_regex(
        source,
        r"_renderMagazine\([\s\S]*?this\._normalizeIndex\(items\)",
        "magazine uses carousel index",
    )
    assert_not_magazine_blocked = "preset === 'list' || preset === 'magazine'" not in source
    if not assert_not_magazine_blocked:
        fail("magazine should support auto-advance (remove magazine from block list)")

    assert_contains(source, "class=\"list-row\"", "list distinct row layout")
    assert_contains(source, "class=\"card-row\"", "card distinct row layout")
    assert_contains(source, "magazine-meta", "magazine meta row")

    print("PASS: card preset static checks (source + built bundle)")


if __name__ == "__main__":
    main()
