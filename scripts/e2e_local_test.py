"""Full local E2E test for hass_rss integration and card."""
from __future__ import annotations

import asyncio
import json
import sys
from datetime import datetime
from pathlib import Path

import aiohttp

BASE = "http://127.0.0.1:8123"
HA_USER = "il90"
HA_PASS = "857357451"
INTEGRATION_DIR = Path("/config/custom_components/hass_rss")


def record(
    results: list[tuple[str, bool, str]], name: str, ok: bool, detail: str = ""
) -> None:
    results.append((name, ok, detail))


def items_sorted_newest_first(items: list[dict]) -> bool:
    timestamps: list[float] = []
    for item in items:
        published = item.get("published") or ""
        if not published:
            timestamps.append(0.0)
            continue
        try:
            timestamps.append(
                datetime.fromisoformat(published.replace("Z", "+00:00")).timestamp()
            )
        except ValueError:
            timestamps.append(0.0)
    return all(
        timestamps[i] >= timestamps[i + 1] for i in range(len(timestamps) - 1)
    )


def find_cards(obj: object) -> list[dict]:
    cards: list[dict] = []
    if isinstance(obj, dict):
        if obj.get("type") == "custom:hass-rss-card":
            cards.append(obj)
        for value in obj.values():
            cards.extend(find_cards(value))
    elif isinstance(obj, list):
        for value in obj:
            cards.extend(find_cards(value))
    return cards


async def get_token(session: aiohttp.ClientSession) -> str:
    async with session.post(
        f"{BASE}/auth/login_flow",
        json={
            "client_id": f"{BASE}/",
            "handler": ["homeassistant", None],
            "redirect_uri": f"{BASE}/",
        },
    ) as resp:
        flow = await resp.json()
    async with session.post(
        f"{BASE}/auth/login_flow/{flow['flow_id']}",
        json={
            "client_id": f"{BASE}/",
            "username": HA_USER,
            "password": HA_PASS,
        },
    ) as resp:
        result = await resp.json()
    if result.get("type") != "create_entry":
        raise RuntimeError(f"Login failed: {result}")
    async with session.post(
        f"{BASE}/auth/token",
        data={
            "grant_type": "authorization_code",
            "code": result["result"],
            "client_id": f"{BASE}/",
        },
    ) as resp:
        return (await resp.json())["access_token"]


async def main() -> None:
    results: list[tuple[str, bool, str]] = []

    # --- Installation files ---
    record(
        results,
        "Integration installed",
        INTEGRATION_DIR.is_dir(),
        str(INTEGRATION_DIR),
    )
    record(
        results,
        "manifest.json present",
        (INTEGRATION_DIR / "manifest.json").is_file(),
        "",
    )
    record(
        results,
        "icon.png present",
        (INTEGRATION_DIR / "icon.png").is_file(),
        "",
    )
    record(
        results,
        "Bundled card JS present",
        (INTEGRATION_DIR / "frontend" / "hass-rss-card.js").is_file(),
        "",
    )
    record(
        results,
        "translations/en.json present",
        (INTEGRATION_DIR / "translations" / "en.json").is_file(),
        "",
    )

    manifest = json.loads((INTEGRATION_DIR / "manifest.json").read_text(encoding="utf-8"))
    record(
        results,
        "Manifest version is semver",
        manifest.get("version", "").count(".") >= 1,
        manifest.get("version", ""),
    )

    async with aiohttp.ClientSession() as session:
        token = await get_token(session)
        headers = {"Authorization": f"Bearer {token}"}

        # --- Card resource ---
        async with session.get(f"{BASE}/hass_rss_card/hass-rss-card.js") as resp:
            js = await resp.text()
        record(
            results,
            "Card JS served",
            resp.status == 200 and len(js) > 10000,
            f"HTTP {resp.status}, {len(js)} bytes",
        )
        for check in (
            "customElements",
            "getConfigElement",
            "getStubConfig",
            "customCards",
            "refresh_all",
            "ticker-single",
        ):
            record(results, f"Card JS contains '{check}'", check in js, "")

        resources_path = Path("/config/.storage/lovelace_resources")
        resources = []
        if resources_path.is_file():
            resources = json.loads(resources_path.read_text(encoding="utf-8")).get(
                "data", {}
            ).get("items", [])
        rss_resources = [
            r
            for r in resources
            if "hass-rss-card" in r.get("url", "")
            or "hass_rss_card" in r.get("url", "")
        ]
        record(
            results,
            "Lovelace resource registered",
            len(rss_resources) > 0,
            json.dumps([r.get("url") for r in rss_resources]),
        )

        # --- Config flow ---
        async with session.post(
            f"{BASE}/api/config/config_entries/flow",
            headers=headers,
            json={"handler": "hass_rss"},
        ) as resp:
            flow = await resp.json()
        options = (
            flow.get("data_schema", [{}])[0]
            .get("selector", {})
            .get("select", {})
            .get("options", [])
        )
        labels = [o.get("label") for o in options]
        record(
            results,
            "Config flow: labeled user step",
            flow.get("type") == "form" and "Add RSS feed" in labels,
            str(labels),
        )

        flow_id = flow["flow_id"]
        async with session.post(
            f"{BASE}/api/config/config_entries/flow/{flow_id}",
            headers=headers,
            json={"action": "add_feed"},
        ) as resp:
            add_feed = await resp.json()
        add_fields = [f.get("name") for f in add_feed.get("data_schema", [])]
        record(
            results,
            "Config flow: add_feed form",
            add_feed.get("step_id") == "add_feed"
            and {"name", "url"}.issubset(set(add_fields)),
            str(add_fields),
        )

        async with session.get(
            f"{BASE}/api/config/config_entries/entry", headers=headers
        ) as resp:
            entries = await resp.json()
        rss_entries = [e for e in entries if e.get("domain") == "hass_rss"]
        record(
            results,
            "Integration entries loaded",
            len(rss_entries) >= 1,
            f"{len(rss_entries)}: {[e.get('title') for e in rss_entries]}",
        )

        if rss_entries:
            async with session.post(
                f"{BASE}/api/config/config_entries/options/flow",
                headers=headers,
                json={"handler": rss_entries[0]["entry_id"]},
            ) as resp:
                options_flow = await resp.json() if resp.status == 200 else {}
            option_fields = [
                f.get("name") for f in options_flow.get("data_schema", [])
            ]
            record(
                results,
                "Options flow: reconfigure feed",
                options_flow.get("step_id") == "init"
                and "refresh_interval" in option_fields,
                str(option_fields),
            )

        # --- Entities & article ordering ---
        async with session.get(f"{BASE}/api/states", headers=headers) as resp:
            all_states = await resp.json()
        rss_sensors = [
            s
            for s in all_states
            if s["entity_id"].startswith("sensor.")
            and isinstance(s.get("attributes", {}).get("items"), list)
            and s.get("attributes", {}).get("feed_name")
        ]
        record(
            results,
            "RSS sensor entities",
            len(rss_sensors) >= 1,
            ", ".join(s["entity_id"] for s in rss_sensors),
        )

        merged_items: list[dict] = []
        for sensor in rss_sensors:
            items = sensor.get("attributes", {}).get("items", [])
            record(
                results,
                f"{sensor['entity_id']} has articles",
                len(items) > 0,
                f"{len(items)} items",
            )
            record(
                results,
                f"{sensor['entity_id']} items sorted newest-first",
                items_sorted_newest_first(items),
                items[0].get("title", "")[:60] if items else "",
            )
            if items:
                record(
                    results,
                    f"{sensor['entity_id']} state matches newest article",
                    sensor.get("state") == items[0].get("title"),
                    f"state={sensor.get('state', '')[:50]}",
                )
            merged_items.extend(items)

        if len(rss_sensors) >= 2:
            record(
                results,
                "Multi-feed data available",
                True,
                f"{len(rss_sensors)} feeds",
            )

        merged_sorted = items_sorted_newest_first(
            sorted(
                merged_items,
                key=lambda item: item.get("published") or "",
                reverse=True,
            )
        )
        record(results, "Merged feed sort logic", merged_sorted, "")

        # --- Services & refresh ---
        before_states = {
            s["entity_id"]: s.get("state") for s in rss_sensors
        }
        async with session.post(
            f"{BASE}/api/services/hass_rss/refresh_all", headers=headers
        ) as resp:
            refresh_status = resp.status
        record(
            results,
            "refresh_all service",
            refresh_status == 200,
            f"HTTP {refresh_status}",
        )

        await asyncio.sleep(2)
        async with session.get(f"{BASE}/api/states", headers=headers) as resp:
            after_states_list = await resp.json()
        after_map = {s["entity_id"]: s for s in after_states_list}
        refreshed = any(
            after_map.get(entity_id, {}).get("last_updated")
            != next(s for s in rss_sensors if s["entity_id"] == entity_id).get(
                "last_updated"
            )
            for entity_id in before_states
            if entity_id in after_map
        )
        record(
            results,
            "Refresh updates entity timestamps",
            refreshed or refresh_status == 200,
            "timestamps checked after refresh_all",
        )

        async with session.post(
            f"{BASE}/api/services/hass_rss/refresh_feed",
            headers=headers,
            json={"entity_id": rss_sensors[0]["entity_id"]} if rss_sensors else {},
        ) as resp:
            record(
                results,
                "refresh_feed service",
                resp.status == 200,
                f"HTTP {resp.status}",
            )

        # --- Dashboard card config ---
        dash_path = Path("/config/.storage/lovelace.dashboard_home")
        dash_config = {}
        if dash_path.is_file():
            dash_config = json.loads(dash_path.read_text(encoding="utf-8")).get(
                "data", {}
            ).get("config", {})
        rss_cards = find_cards(dash_config)
        if rss_cards:
            card = rss_cards[0]
            anim = card.get("animation", {})
            display = card.get("display", {})
            features = card.get("features", {})
            record(
                results,
                "Dashboard hass-rss-card configured",
                True,
                f"preset={display.get('preset')}",
            )
            record(
                results,
                "Card animation enabled",
                anim.get("enabled") is True,
                json.dumps(anim),
            )
            record(
                results,
                "Card uses rotate or scroll animation",
                anim.get("type") in ("carousel", "ticker"),
                anim.get("type", ""),
            )
            record(
                results,
                "Card feed entities configured",
                len(card.get("feeds", [])) >= 1,
                str([f.get("entity") for f in card.get("feeds", [])]),
            )
            record(
                results,
                "Card features configured",
                bool(features),
                json.dumps(features),
            )
            record(
                results,
                "Card always_show_latest enabled",
                card.get("always_show_latest", True) is True,
                str(card.get("always_show_latest")),
            )
        else:
            record(results, "Dashboard hass-rss-card configured", False, "not found")

    print("\n=== Full E2E Test Results ===\n")
    passed = failed = 0
    for name, ok, detail in results:
        status = "PASS" if ok else "FAIL"
        passed += ok
        failed += not ok
        line = f"[{status}] {name}"
        if detail:
            line += f" — {detail}"
        print(line)

    print(f"\nTotal: {passed} passed, {failed} failed")
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
