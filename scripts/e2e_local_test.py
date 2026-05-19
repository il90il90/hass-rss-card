"""Full local E2E test for hass-rss integration and card."""
from __future__ import annotations

import asyncio
import json
import sys

import aiohttp

BASE = "http://127.0.0.1:8123"
HA_USER = "il90"
HA_PASS = "857357451"


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

    async with aiohttp.ClientSession() as session:
        token = await get_token(session)
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Card JS served from integration
        async with session.get(f"{BASE}/hass_rss_card/hass-rss-card.js") as resp:
            js = await resp.text()
            ok = resp.status == 200 and "customElements.define" in js
            results.append(
                (
                    "Card JS at /hass_rss_card/hass-rss-card.js",
                    ok,
                    f"HTTP {resp.status}, {len(js)} bytes",
                )
            )

        checks = ["customElements", "getConfigElement", "getStubConfig", "customCards"]
        for check in checks:
            results.append(
                (f"Card JS contains '{check}'", check in js, "")
            )

        # 2. Lovelace resources
        from pathlib import Path

        resources_path = Path("/config/.storage/lovelace_resources")
        if resources_path.is_file():
            resources_data = json.loads(resources_path.read_text(encoding="utf-8"))
            resources = resources_data.get("data", {}).get("items", [])
        else:
            resources = []
        rss_resources = [
            r for r in resources
            if "hass-rss-card" in r.get("url", "") or "hass_rss_card" in r.get("url", "")
        ]
        results.append(
            (
                "Lovelace resource registered",
                len(rss_resources) > 0,
                json.dumps([r.get("url") for r in rss_resources]),
            )
        )

        # 3. Config flow user step (form with labels)
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
        results.append(
            (
                "Config flow shows labeled options",
                flow.get("type") == "form" and "Add RSS feed" in labels,
                str(labels),
            )
        )

        # 4. Integration entries and entities
        async with session.get(
            f"{BASE}/api/config/config_entries/entry", headers=headers
        ) as resp:
            entries = await resp.json()
        rss_entries = [e for e in entries if e.get("domain") == "hass_rss"]
        results.append(
            (
                "RSS feeds configured",
                len(rss_entries) >= 1,
                f"{len(rss_entries)} entries: {[e.get('title') for e in rss_entries]}",
            )
        )

        entities = []
        for entry in rss_entries:
            async with session.get(f"{BASE}/api/states", headers=headers) as resp:
                states = await resp.json()
            for st in states:
                if st["entity_id"].startswith("sensor.") and st.get(
                    "attributes", {}
                ).get("feed_name"):
                    if any(
                        e["entry_id"] == entry["entry_id"] for e in rss_entries
                    ):
                        entities.append(st)
                        break

        # Find RSS sensor entities
        async with session.get(f"{BASE}/api/states", headers=headers) as resp:
            all_states = await resp.json()
        rss_sensors = [
            s
            for s in all_states
            if s["entity_id"].startswith("sensor.")
            and s.get("attributes", {}).get("items") is not None
            and s.get("attributes", {}).get("feed_name")
        ]
        results.append(
            (
                "RSS sensor entities loaded",
                len(rss_sensors) >= 1,
                ", ".join(s["entity_id"] for s in rss_sensors),
            )
        )

        for sensor in rss_sensors[:2]:
            items = sensor.get("attributes", {}).get("items", [])
            results.append(
                (
                    f"{sensor['entity_id']} has items",
                    len(items) > 0,
                    f"{len(items)} items",
                )
            )

        # 5. refresh_all service
        async with session.post(
            f"{BASE}/api/services/hass_rss/refresh_all", headers=headers
        ) as resp:
            results.append(
                ("refresh_all service", resp.status == 200, f"HTTP {resp.status}")
            )

        # 6. Dashboard config has hass-rss-card with ticker animation
        dash_path = Path("/config/.storage/lovelace.dashboard_home")
        if dash_path.is_file():
            dash_config = json.loads(dash_path.read_text(encoding="utf-8")).get(
                "data", {}
            ).get("config", {})
        else:
            dash_config = {}

        def find_cards(obj):
            cards = []
            if isinstance(obj, dict):
                if obj.get("type") == "custom:hass-rss-card":
                    cards.append(obj)
                for v in obj.values():
                    cards.extend(find_cards(v))
            elif isinstance(obj, list):
                for item in obj:
                    cards.extend(find_cards(item))
            return cards

        rss_cards = find_cards(dash_config)
        if rss_cards:
            card = rss_cards[0]
            anim = card.get("animation", {})
            results.append(
                (
                    "Dashboard has hass-rss-card",
                    True,
                    f"preset={card.get('display', {}).get('preset')}",
                )
            )
            results.append(
                (
                    "Ticker animation enabled",
                    anim.get("enabled") and anim.get("type") == "ticker",
                    json.dumps(anim),
                )
            )
            feed_entities = [f.get("entity") for f in card.get("feeds", [])]
            results.append(
                ("Card feed entities configured", len(feed_entities) >= 1, str(feed_entities))
            )
        else:
            results.append(("Dashboard has hass-rss-card", False, "not found in config"))

    print("\n=== E2E Test Results ===\n")
    passed = 0
    failed = 0
    for name, ok, detail in results:
        status = "PASS" if ok else "FAIL"
        if ok:
            passed += 1
        else:
            failed += 1
        line = f"[{status}] {name}"
        if detail:
            line += f" — {detail}"
        print(line)

    print(f"\nTotal: {passed} passed, {failed} failed")
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
