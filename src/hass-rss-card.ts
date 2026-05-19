import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { DEFAULT_CONFIG, mergeConfig } from './config-defaults';
import './hass-rss-card-editor';
import { compactStyles } from './styles/compact';
import { cardStyles, imageStyles } from './styles/shared';
import { tickerStyles } from './styles/ticker';
import type {
  AnimationConfig,
  DisplayConfig,
  FeaturesConfig,
  HassRssCardConfig,
  HomeAssistant,
  ImageConfig,
  RssItem,
} from './types';
import {
  showIncludesImage,
  showIncludesSummary,
  SPEED_PRESET_VALUES,
  type SpeedPreset,
} from './types';
import { getFeedEntityIds, mergeFeedItems } from './utils/merge-items';
import { isNewItem, isRead, markRead } from './utils/read-state';
import { formatRelativeTime } from './utils/relative-time';
import { prefersReducedMotion, resolveDirection } from './utils/rtl';

@customElement('hass-rss-card')
export class HassRssCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config!: HassRssCardConfig;

  @state() private _carouselIndex = 0;

  @state() private _refreshing = false;

  @state() private _tickerPaused = false;

  @state() private _readVersion = 0;

  private _carouselTimer: ReturnType<typeof setInterval> | undefined;

  static styles = [cardStyles, imageStyles, compactStyles, tickerStyles];

  public setConfig(config: HassRssCardConfig): void {
    const feeds = (config.feeds ?? []).filter(
      (feed) => feed.entity && feed.entity.trim().length > 0,
    );
    if (!feeds.length) {
      throw new Error('Configure at least one feed entity');
    }
    this._config = mergeConfig({ ...config, feeds });
    this._applyPresetDefaults();
  }

  public getCardSize(): number {
    const preset = this._config?.display?.preset;
    if (preset === 'ticker') return 1;
    if (preset === 'list') return 4;
    if (preset === 'magazine') return 4;
    return 2;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearCarouselTimer();
  }

  updated(changed: Map<string, unknown>): void {
    if (changed.has('hass') || changed.has('_config')) {
      this._syncCarousel();
    }
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return html``;

    const items = this._getItems();
    const dir = resolveDirection(
      this._config.rtl,
      items[0]?.title,
    );
    const preset = this._config.display?.preset ?? 'compact';
    const features = this._config.features ?? {};

    return html`
      <ha-card
        class=${classMap({ loading: this._refreshing })}
        dir=${dir}
      >
        ${this._renderHeader(features)}
        ${items.length === 0
          ? this._renderEmpty()
          : this._renderPreset(preset, items, dir, features)}
      </ha-card>
    `;
  }

  private _renderHeader(features: FeaturesConfig): TemplateResult | typeof nothing {
    if (!features.show_refresh_button) return nothing;

    return html`
      <div class="header">
        <span class="header-title">
          <ha-icon icon="mdi:rss"></ha-icon>
          RSS
        </span>
        <button
          class="refresh-btn ${this._refreshing ? 'spinning' : ''}"
          title="Refresh feeds"
          @click=${this._handleRefresh}
        >
          <ha-icon icon="mdi:refresh"></ha-icon>
        </button>
      </div>
    `;
  }

  private _renderEmpty(): TemplateResult {
    const hasMissing = (this._config.feeds ?? []).some(
      (f) => !this.hass.states[f.entity],
    );
    if (hasMissing) {
      return html`<div class="error">One or more feed entities are unavailable.</div>`;
    }
    return html`<div class="empty">No articles available.</div>`;
  }

  private _renderPreset(
    preset: string,
    items: RssItem[],
    dir: 'rtl' | 'ltr',
    features: FeaturesConfig,
  ): TemplateResult {
    switch (preset) {
      case 'ticker':
        return this._renderTicker(items, dir, features);
      case 'list':
        return this._renderList(items, features);
      case 'card':
        return this._renderCard(items, features);
      case 'magazine':
        return this._renderMagazine(items, features);
      default:
        return this._renderCompact(items, features);
    }
  }

  private _renderCompact(items: RssItem[], features: FeaturesConfig): TemplateResult {
    const animation = this._config.animation ?? {};
    const useCarousel =
      animation.enabled &&
      animation.type === 'carousel' &&
      !prefersReducedMotion() &&
      items.length > 1;

    if (useCarousel) {
      const item = items[this._carouselIndex] ?? items[0];
      return html`
        <div class="carousel-container">
          ${this._renderCompactItem(item, features, animation.transition)}
        </div>
      `;
    }

    const item = items[0];
    return this._renderCompactItem(item, features);
  }

  private _renderCompactItem(
    item: RssItem,
    features: FeaturesConfig,
    transition?: string,
  ): TemplateResult {
    void this._readVersion;
    const display = this._config.display ?? {};
    const imageCfg = display.image ?? {};
    const position = imageCfg.position ?? 'start';
    const read = !!(features.track_read_unread && isRead(item.link));

    return html`
      <div
        class=${classMap({
          'compact-item': true,
          item: true,
          read: read,
          'image-top': position === 'top',
          'image-end': position === 'end',
          'carousel-item': !!transition,
          'fade-out': false,
        })}
      >
        ${this._renderImage(item, display, imageCfg)}
        <div class="compact-content">
          <div class="compact-row">
            <div class="compact-title">
              ${this._renderNewBadge(item, features)}
              <span
                class="item-link"
                @click=${() => this._openItem(item)}
              >${item.title}</span>
            </div>
            ${features.show_relative_time
              ? html`<span class="meta">${formatRelativeTime(
                  item.published,
                  this.hass.locale?.language,
                )}</span>`
              : nothing}
          </div>
          ${showIncludesSummary(display.show)
            ? html`<div class="compact-summary">${item.summary ?? ''}</div>`
            : nothing}
          ${item.feed_name
            ? html`<div class="feed-name">${item.feed_name}</div>`
            : nothing}
        </div>
      </div>
    `;
  }

  private _renderTicker(
    items: RssItem[],
    _dir: 'rtl' | 'ltr',
    features: FeaturesConfig,
  ): TemplateResult {
    void this._readVersion;
    const animation = this._config.animation ?? {};
    const enabled =
      animation.enabled !== false && !prefersReducedMotion();
    const speed = this._resolveSpeed(animation);
    const duration = this._estimateTickerDuration(items.length, speed);
    const display = this._config.display ?? {};
    const doubled = enabled ? [...items, ...items] : items;

    return html`
      <div
        class="ticker-wrap"
        @mouseenter=${() => {
          if (animation.pause_on_hover) this._tickerPaused = true;
        }}
        @mouseleave=${() => {
          this._tickerPaused = false;
        }}
      >
        <div
          class=${classMap({
            'ticker-track': true,
            paused: this._tickerPaused,
            'no-animation': !enabled,
          })}
          style=${enabled ? `--ticker-duration: ${duration}s` : nothing}
        >
          ${doubled.map(
            (item, i) => html`
              <div class="ticker-item item ${features.track_read_unread && isRead(item.link) ? 'read' : ''}">
                ${this._renderImage(item, display, display.image ?? {}, 'small')}
                ${this._renderNewBadge(item, features)}
                <span class="ticker-title item-link" @click=${() => this._openItem(item)}>
                  ${item.title}
                </span>
                ${i < doubled.length - 1
                  ? html`<span class="ticker-separator">•</span>`
                  : nothing}
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }

  private _renderList(items: RssItem[], features: FeaturesConfig): TemplateResult {
    void this._readVersion;
    const display = this._config.display ?? {};
    return html`
      <div class="list-items">
        ${items.map(
          (item) => html`
            <div class="list-item item ${features.track_read_unread && isRead(item.link) ? 'read' : ''}">
              ${this._renderImage(item, display, display.image ?? {})}
              <div class="compact-content">
                <div class="compact-title">
                  ${this._renderNewBadge(item, features)}
                  <span class="item-link" @click=${() => this._openItem(item)}>${item.title}</span>
                </div>
                ${showIncludesSummary(display.show)
                  ? html`<div class="compact-summary">${item.summary ?? ''}</div>`
                  : nothing}
                ${features.show_relative_time
                  ? html`<div class="meta">${formatRelativeTime(
                      item.published,
                      this.hass.locale?.language,
                    )}</div>`
                  : nothing}
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }

  private _renderCard(items: RssItem[], features: FeaturesConfig): TemplateResult {
    const item = items[0];
    void this._readVersion;
    const display = this._config.display ?? {};
    const imageCfg = display.image ?? {};
    return html`
      <div class="card-item image-top item">
        ${this._renderImage(item, display, { ...imageCfg, position: 'top' }, 'large')}
        <div class="compact-title">
          ${this._renderNewBadge(item, features)}
          <span class="item-link" @click=${() => this._openItem(item)}>${item.title}</span>
        </div>
        ${showIncludesSummary(display.show)
          ? html`<div class="compact-summary">${item.summary ?? ''}</div>`
          : nothing}
      </div>
    `;
  }

  private _renderMagazine(items: RssItem[], features: FeaturesConfig): TemplateResult {
    const item = items[0];
    void this._readVersion;
    return html`
      <div class="magazine-item item">
        ${item.image && item.has_image
          ? html`<img
              class="magazine-bg"
              src=${item.image}
              alt=""
              loading="lazy"
              @error=${(e: Event) => this._hideImage(e)}
            />`
          : html`<div class="magazine-bg" style="background: var(--primary-color); opacity: 0.3;"></div>`}
        <div class="magazine-overlay">
          ${this._renderNewBadge(item, features)}
          <div class="magazine-title item-link" @click=${() => this._openItem(item)}>
            ${item.title}
          </div>
        </div>
      </div>
    `;
  }

  private _renderImage(
    item: RssItem,
    display: DisplayConfig,
    imageCfg: ImageConfig,
    sizeOverride?: 'small' | 'medium' | 'large',
  ): TemplateResult | typeof nothing {
    if (!showIncludesImage(display.show)) return nothing;

    const size = sizeOverride ?? imageCfg.size ?? 'medium';
    const fit = imageCfg.fit === 'contain' ? 'fit-contain' : '';

    if (item.image && item.has_image) {
      return html`
        <img
          class="item-image size-${size} ${fit}"
          src=${item.image}
          alt=""
          loading="lazy"
          @error=${(e: Event) => this._hideImage(e)}
        />
      `;
    }

    if (imageCfg.fallback === 'placeholder') {
      return html`
        <div class="placeholder-image size-${size}">
          <ha-icon icon="mdi:image-off-outline"></ha-icon>
        </div>
      `;
    }

    return nothing;
  }

  private _renderNewBadge(
    item: RssItem,
    features: FeaturesConfig,
  ): TemplateResult | typeof nothing {
    if (!features.show_new_badge) return nothing;
    const duration = features.new_badge_duration ?? 3600;
    if (!isNewItem(item.published, duration, item.link)) return nothing;
    return html`<span class="new-badge">NEW</span>`;
  }

  private _getItems(): RssItem[] {
    const maxItems = this._config.display?.max_items ?? 5;
    return mergeFeedItems(this.hass, this._config.feeds ?? [], maxItems);
  }

  private _openItem(item: RssItem): void {
    if (this._config.features?.track_read_unread) {
      markRead(item.link);
      this._readVersion += 1;
    }
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  }

  private async _handleRefresh(): Promise<void> {
    if (this._refreshing) return;
    this._refreshing = true;
    const entities = getFeedEntityIds(this._config.feeds ?? []);
    try {
      for (const entityId of entities) {
        await this.hass.callService('hass_rss', 'refresh_feed', {
          entity_id: entityId,
        });
      }
    } finally {
      setTimeout(() => {
        this._refreshing = false;
      }, 800);
    }
  }

  private _applyPresetDefaults(): void {
    const preset = this._config.display?.preset;
    if (!this._config.animation) this._config.animation = {};

    if (preset === 'ticker') {
      if (this._config.animation.enabled === undefined) {
        this._config.animation.enabled = true;
      }
      if (!this._config.animation.type) {
        this._config.animation.type = 'ticker';
      }
    }
  }

  private _resolveSpeed(animation: AnimationConfig): number {
    const preset = (animation.speed_preset ?? 'medium') as SpeedPreset;
    if (preset === 'custom') return animation.speed ?? 50;
    return SPEED_PRESET_VALUES[preset];
  }

  private _estimateTickerDuration(itemCount: number, speedPxPerSec: number): number {
    const estimatedWidth = Math.max(itemCount, 1) * 280;
    return Math.max(estimatedWidth / speedPxPerSec, 10);
  }

  private _syncCarousel(): void {
    this._clearCarouselTimer();
    const animation = this._config?.animation;
    const items = this._getItems();

    if (
      !animation?.enabled ||
      animation.type !== 'carousel' ||
      prefersReducedMotion() ||
      items.length <= 1
    ) {
      return;
    }

    if (this._config.always_show_latest) {
      this._carouselIndex = 0;
    }

    const interval = (animation.interval ?? 8) * 1000;
    this._carouselTimer = setInterval(() => {
      if (this._config.always_show_latest) {
        this._carouselIndex = 0;
      } else {
        this._carouselIndex = (this._carouselIndex + 1) % items.length;
      }
      this.requestUpdate();
    }, interval);
  }

  private _clearCarouselTimer(): void {
    if (this._carouselTimer) {
      clearInterval(this._carouselTimer);
      this._carouselTimer = undefined;
    }
  }

  private _hideImage(e: Event): void {
    const img = e.target as HTMLImageElement;
    img.classList.add('hidden');
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement('hass-rss-card-editor');
  }

  public static getStubConfig(hass?: HomeAssistant): HassRssCardConfig {
    const entity =
      hass &&
      Object.keys(hass.states).find((id) =>
        id.startsWith('sensor.') &&
        hass.states[id]?.attributes?.feed_name,
      );
    return {
      ...DEFAULT_CONFIG,
      feeds: entity ? [{ entity }] : [],
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hass-rss-card': HassRssCard;
  }
}

(window as unknown as CustomCardsWindow).customCards =
  (window as unknown as CustomCardsWindow).customCards ?? [];
(window as unknown as CustomCardsWindow).customCards!.push({
  type: 'hass-rss-card',
  name: 'HASS RSS Card',
  description: 'Display RSS feeds from the HASS RSS integration',
  preview: true,
  documentationURL:
    'https://github.com/your-org/hass-rss-card#readme',
});

interface CustomCardsWindow extends Window {
  customCards?: Array<{
    type: string;
    name: string;
    description: string;
    preview?: boolean;
    documentationURL?: string;
  }>;
}
