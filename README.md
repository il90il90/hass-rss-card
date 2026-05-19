# HASS RSS Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![GitHub release](https://img.shields.io/github/release/il90il90/hass-rss-card.svg)](https://github.com/il90il90/hass-rss-card/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A unified [Home Assistant](https://www.home-assistant.io/) project that ships **both** an RSS integration and a Lovelace card from a single repository.

| Component | Description |
|-----------|-------------|
| **HASS RSS** integration | Polls RSS/Atom feeds, creates sensor entities, optional notifications |
| **HASS RSS Card** | Lovelace card with multiple layout presets, animations, and a Visual Editor |

Feeds are fetched **server-side** by the integration, so the card never hits CORS or browser fetch limits. The card reads live data from sensor entities and supports merging multiple feeds, RTL content, images, and read/unread tracking.

---

## Quick install (HACS)

### 1. Add the repository to HACS

If this repository is not yet in the default HACS store, add it once as a custom repository:

**HACS → Integrations → ⋮ → Custom repositories**

| Field | Value |
|-------|-------|
| Repository | `https://github.com/il90il90/hass-rss-card` |
| Category | **Integration** |

Then click **Add**.

### 2. Install with one click

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=il90il90&repository=hass-rss-card&category=integration)

Or manually: **HACS → Integrations → search for "HASS RSS" → Download → Restart Home Assistant**.

This installs the **HASS RSS** integration (`custom_components/hass_rss`), which **automatically registers the Lovelace card** — no manual resource step needed in most setups.

### 3. Verify the card resource (usually automatic)

After restart, the integration registers the card at `/hass_rss_card/hass-rss-card.js`.

Check **Settings → Dashboards → Resources** — you should see **HASS RSS Card** listed as a JavaScript Module.

If it is missing (for example in YAML Lovelace mode), add it manually:

| Field | Value |
|-------|-------|
| URL | `/hass_rss_card/hass-rss-card.js` |
| Resource type | **JavaScript Module** |

> **Note:** Installing via HACS as **Integration** does not install the card separately. The card is bundled inside the integration and registered on startup.

### 4. Set up the integration

[![Open your Home Assistant instance and start setting up a new integration.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=hass_rss)

Or manually: **Settings → Devices & Services → Add Integration → HASS RSS**.

Choose **Add RSS feed** or **Import OPML**, fill in the feed details, and submit.

### 5. Add the card to your dashboard

**Dashboard → Edit → Add card → search "RSS" → HASS RSS Card** (under Community cards).

If the card does not appear:

1. Confirm the integration is installed and Home Assistant was restarted
2. Check **Settings → Dashboards → Resources** for `/hass_rss_card/hass-rss-card.js`
3. Hard-refresh the browser or restart the Companion app to clear cached resources
4. In YAML Lovelace mode, add the resource manually (see step 3 above)

Use the Visual Editor to pick your RSS sensor entities and configure layout, animation, and features.

---

## What this add-on does

### HASS RSS integration

The integration connects Home Assistant to any RSS or Atom feed and keeps a sensor entity updated with the latest headlines and article metadata.

**Capabilities:**

- **Config Flow UI** — add feeds without editing YAML
- **OPML import** — bulk-add many feeds from an OPML file
- **Per-feed settings** — refresh interval, category label, max items
- **Image extraction** — pulls images from media tags, enclosures, and HTML content
- **Health monitoring** — `last_success`, `last_error`, `item_count` attributes
- **Optional notifications** — push alerts on new articles (**disabled by default**)
- **Diagnostics** — download debug info from the integration page
- **Services** — manually refresh one feed or all feeds

Each feed becomes a sensor entity (for example `sensor.news`) whose state is the latest headline and whose attributes contain the full item list, links, summaries, and images.

### HASS RSS Card

The card displays articles from one or more HASS RSS sensor entities on your Lovelace dashboard.

**Capabilities:**

- **Multiple presets** — compact, ticker, card, list, magazine
- **Multi-feed merge** — combine several sensors, sorted by publish date
- **Images** — configurable size, position, and fit; RTL-aware layout
- **Animations** — continuous ticker scroll or carousel rotation
- **NEW badge** — highlight recently published articles
- **Read / unread** — tracked locally in the browser (localStorage)
- **Relative time** — "5 minutes ago" style timestamps
- **Refresh button** — triggers `hass_rss.refresh_all` from the card
- **RTL support** — automatic or manual right-to-left content layout
- **Visual Editor** — full GUI configuration in English (Sources, Display, Animation, Features, Layout)

Because the card reads entity data instead of fetching RSS URLs directly, it works reliably with feeds that block browser requests or require special headers.

---

## Features

### Integration

- Config Flow UI to add RSS feeds
- OPML bulk import
- Configurable refresh interval per feed (1–1440 minutes)
- Optional category/channel label for card filtering
- Image extraction from RSS entries (media, enclosures, HTML)
- Optional push notifications on new articles (disabled by default)
- Health attributes: `last_success`, `last_error`, `item_count`
- Diagnostics download
- Services: `hass_rss.refresh_feed`, `hass_rss.refresh_all`

### Card

- Reads data from HASS RSS sensor entities (no browser CORS issues)
- Multiple feeds merged and sorted by date
- Presets: **compact**, **ticker**, **card**, **list**, **magazine**
- Images with RTL-aware layout (`start` / `end` / `top`)
- Animations: continuous **ticker scroll** or **carousel**
- NEW badge, read/unread tracking (localStorage), relative time
- Manual refresh button
- Full Visual Editor (English UI)
- RTL content support (`auto`, `true`, `false`)

---

## Manual installation

Use this if you do not use HACS.

1. Copy `custom_components/hass_rss` to your Home Assistant `config/custom_components/` directory.
2. Restart Home Assistant — the card resource is registered automatically at `/hass_rss_card/hass-rss-card.js`.
3. Add the integration via **Settings → Devices & Services → Add Integration → HASS RSS**.

---

## Configuration

### Add an RSS feed

**Settings → Devices & Services → HASS RSS → Add service → Add RSS feed**

| Field | Description |
|-------|-------------|
| Name | Display name (also used for the entity) |
| URL | RSS or Atom feed URL |
| Refresh interval | Minutes between polls (default: 5) |
| Category | Optional label for card filtering |
| Max items | Maximum articles stored (default: 20) |
| Enable notifications | Off by default |

### Reconfigure a feed

**Settings → Devices & Services → HASS RSS → Configure** (on a specific feed)

Change refresh interval, category, max items, or notification settings without removing the feed.

### Import OPML

**Settings → Devices & Services → HASS RSS → Add service → Import OPML**

Provide an OPML file URL to add multiple feeds at once.

---

## Card configuration examples

### Compact with image

```yaml
type: custom:hass-rss-card
feeds:
  - entity: sensor.news
display:
  preset: compact
  show: title_image
  max_items: 5
features:
  show_relative_time: true
  show_new_badge: true
rtl: auto
```

### Ticker with scrolling animation

```yaml
type: custom:hass-rss-card
feeds:
  - entity: sensor.news
  - entity: sensor.sports
    category: sports
display:
  preset: ticker
  show: title_image
  max_items: 10
animation:
  enabled: true
  type: ticker
  speed_preset: medium
  pause_on_hover: true
rtl: auto
```

### Multi-source with carousel

```yaml
type: custom:hass-rss-card
feeds:
  - entity: sensor.news
  - entity: sensor.tech
display:
  preset: compact
  show: title_image_summary
animation:
  enabled: true
  type: carousel
  interval: 8
  transition: fade
always_show_latest: true
```

---

## Optional notifications

Enable per feed in the integration config or Options Flow:

1. Turn on **Enable notifications**
2. Select a **Notify service** (e.g. `notify.mobile_app_phone`)

Notifications are **off by default**.

---

## Services

```yaml
# Refresh a specific feed
service: hass_rss.refresh_feed
data:
  entity_id: sensor.news

# Refresh all feeds
service: hass_rss.refresh_all
```

---

## Entity attributes

```yaml
sensor.news:
  state: "Latest headline"
  attributes:
    link: "https://..."
    published: "2026-05-19T10:00:00+00:00"
    summary: "..."
    image: "https://..."
    has_image: true
    feed_name: "News"
    category: "news"
    items:
      - title: "..."
        link: "..."
        published: "..."
        summary: "..."
        image: "..."
    last_success: "2026-05-19T10:05:00+00:00"
    last_error: null
    item_count: 15
```

---

## Development

### Card (TypeScript)

```bash
npm install
npm run build    # outputs dist/hass-rss-card.js
npm run watch    # development watch mode
```

### Integration (Python)

Copy `custom_components/hass_rss` into your Home Assistant `config/custom_components/` directory and restart.

Requires `feedparser>=6.0.0` (installed automatically).

---

## Requirements

- Home Assistant **2024.1.0** or newer
- [HACS](https://hacs.xyz/) (recommended)

---

## License

MIT — see [LICENSE](LICENSE).
