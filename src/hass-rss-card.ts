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
  FeedConfig,
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
import { getFeedEntityIds, getNewestItem, mergeFeedItems } from './utils/merge-items';
import { isNewItem, isRead, markRead } from './utils/read-state';
import { formatRelativeTime } from './utils/relative-time';
import {
  ALL_SOURCES,
  isAllSources,
  resolveSourceOptions,
  type RssSourceOption,
} from './utils/rss-entities';
import { canEmbedArticleUrl } from './utils/article-open';
import { prefersReducedMotion, resolveDirection } from './utils/rtl';

@customElement('hass-rss-card')
export class HassRssCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config!: HassRssCardConfig;

  @state() private _carouselIndex = 0;

  @state() private _refreshing = false;

  @state() private _tickerPaused = false;

  @state() private _readVersion = 0;

  @state() private _articleDialog: {
    url: string;
    title: string;
    summary?: string;
  } | null = null;

  private _carouselTimer: ReturnType<typeof setInterval> | undefined;

  private _lastLatestKey = '';

  private _carouselSetupKey = '';

  static styles = [cardStyles, imageStyles, compactStyles, tickerStyles];

  public setConfig(config: HassRssCardConfig): void {
    const feeds = (config.feeds ?? []).filter(
      (feed) => feed.entity && feed.entity.trim().length > 0,
    );
    this._config = mergeConfig({ ...config, feeds });
    this._applyPresetDefaults();
    this._carouselSetupKey = '';
  }

  public getCardSize(): number {
    const preset = this._config?.display?.preset;
    if (preset === 'ticker') return 1;
    if (preset === 'list') return 4;
    if (preset === 'magazine') return 4;
    return 2;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._carouselSetupKey = '';
    this._ensureCarouselTimer();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearCarouselTimer();
    this._carouselSetupKey = '';
  }

  updated(changed: Map<string, unknown>): void {
    if (!changed.has('hass') && !changed.has('_config')) {
      return;
    }

    if (changed.has('hass')) {
      const newest = getNewestItem(this._getItems());
      if (newest) {
        const latestKey = newest.link || newest.title || '';
        if (latestKey && latestKey !== this._lastLatestKey) {
          this._carouselIndex = 0;
          this._lastLatestKey = latestKey;
        }
      }
    }

    this._ensureCarouselTimer();
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
        ${this._renderLastUpdated(features, dir)}
        ${items.length === 0
          ? this._renderEmpty()
          : this._renderPreset(preset, items, dir, features)}
      </ha-card>
      ${this._renderArticleDialog()}
    `;
  }

  private _renderHeader(features: FeaturesConfig): TemplateResult | typeof nothing {
    const sources = this._getSourceOptions();
    const showSelector =
      features.show_source_selector !== false && sources.length > 1;
    const showRefresh = features.show_refresh_button !== false;

    if (!showSelector && !showRefresh) {
      return nothing;
    }

    const selection = this._getSourceSelection();

    return html`
      <div class="header">
        <div class="header-left">
          ${showSelector
            ? html`
                <label class="source-label">
                  <select
                    class="source-select"
                    .value=${selection}
                    @change=${this._onSourceChange}
                    @click=${(event: Event) => event.stopPropagation()}
                  >
                    <option value=${ALL_SOURCES}>All sources</option>
                    ${sources.map(
                      (source) => html`
                        <option value=${source.entity}>${source.name}</option>
                      `,
                    )}
                  </select>
                </label>
              `
            : html`
                <span class="header-title">${this._getSourceLabel(sources)}</span>
              `}
        </div>
        ${showRefresh
          ? html`
              <button
                class="refresh-btn ${this._refreshing ? 'spinning' : ''}"
                title="Refresh feed"
                @click=${(event: Event) => {
                  event.stopPropagation();
                  void this._handleRefresh();
                }}
              >
                <ha-icon icon="mdi:refresh"></ha-icon>
              </button>
            `
          : nothing}
      </div>
    `;
  }

  private _renderLastUpdated(
    features: FeaturesConfig,
    dir: 'rtl' | 'ltr',
  ): TemplateResult | typeof nothing {
    if (features.show_last_updated === false) {
      return nothing;
    }

    const lastSuccess = this._getActiveLastSuccess();
    if (!lastSuccess) {
      return nothing;
    }

    const locale =
      dir === 'rtl'
        ? this.hass.locale?.language?.startsWith('he')
          ? this.hass.locale.language
          : 'he'
        : this.hass.locale?.language;
    const relative = formatRelativeTime(lastSuccess, locale);
    if (!relative) {
      return nothing;
    }

    return html`<div class="last-updated">Updated ${relative}</div>`;
  }

  private _getActiveLastSuccess(): string | undefined {
    let latest: string | undefined;

    for (const feed of this._getActiveFeeds()) {
      const lastSuccess = this.hass.states[feed.entity]?.attributes
        ?.last_success as string | undefined;
      if (!lastSuccess) {
        continue;
      }
      if (!latest || Date.parse(lastSuccess) > Date.parse(latest)) {
        latest = lastSuccess;
      }
    }

    return latest;
  }

  private _renderEmpty(): TemplateResult {
    const sources = this._getSourceOptions();

    if (sources.length === 0) {
      return html`
        <div class="empty">
          No RSS sensors found. Add a feed in Settings → Devices &amp; Services →
          HASS RSS.
        </div>
      `;
    }

    const activeFeeds = this._getActiveFeeds();
    const hasMissing = activeFeeds.some((feed) => !this.hass.states[feed.entity]);
    if (hasMissing) {
      return html`<div class="error">The selected RSS sensor is unavailable.</div>`;
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
    const useIndex = this._usesArticleIndex(items, features, !!useCarousel);
    const index = useIndex ? this._normalizeIndex(items) : 0;
    const item = items[index] ?? items[0];

    if (useCarousel || useIndex) {
      return html`
        <div class="carousel-container">
          ${this._renderCompactItem(
            item,
            features,
            useCarousel ? animation.transition : undefined,
          )}
          ${this._renderArticleNavigation(items, features, useIndex)}
        </div>
      `;
    }

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
            ${this._renderRelativeTime(item.published)}
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
    dir: 'rtl' | 'ltr',
    features: FeaturesConfig,
  ): TemplateResult {
    void this._readVersion;
    const animation = this._config.animation ?? {};
    const useCarousel =
      animation.enabled !== false &&
      animation.type === 'carousel' &&
      !prefersReducedMotion() &&
      items.length > 1;

    if (useCarousel) {
      const index = this._normalizeIndex(items);
      const item = items[index] ?? items[0];
      const display = this._config.display ?? {};
      const transition = animation.transition ?? 'fade';
      const useIndex = this._usesArticleIndex(items, features, true);
      return html`
        <div
          class="ticker-wrap ticker-single"
          dir=${dir}
          @mouseenter=${() => {
            if (animation.pause_on_hover) this._tickerPaused = true;
          }}
          @mouseleave=${() => {
            this._tickerPaused = false;
          }}
        >
          <div
            class="ticker-item item carousel-item ${transition} ${features.track_read_unread && isRead(item.link) ? 'read' : ''}"
            key=${`${index}-${item.link}`}
          >
            ${this._renderImage(item, display, display.image ?? {}, 'small')}
            ${this._renderNewBadge(item, features)}
            <span class="ticker-title item-link" @click=${() => this._openItem(item)}>
              ${item.title}
            </span>
            ${this._renderRelativeTime(item.published)}
          </div>
          ${item.feed_name
            ? html`<div class="feed-name">${item.feed_name}</div>`
            : nothing}
          ${this._renderArticleNavigation(items, features, useIndex)}
        </div>
      `;
    }

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
                ${this._renderRelativeTime(item.published)}
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }

  private _renderCard(items: RssItem[], features: FeaturesConfig): TemplateResult {
    const useIndex = this._usesArticleIndex(items, features, false);
    const index = useIndex ? this._normalizeIndex(items) : 0;
    const item = items[index] ?? items[0];
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
        ${item.feed_name
          ? html`<div class="feed-name">${item.feed_name}</div>`
          : nothing}
        ${this._renderArticleNavigation(items, features, useIndex)}
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

  private _getRelativeTimeLocale(): string | undefined {
    const presetDir = resolveDirection(
      this._config.rtl,
      this._getItems()[0]?.title,
    );
    if (presetDir === 'rtl') {
      return this.hass.locale?.language?.startsWith('he')
        ? this.hass.locale.language
        : 'he';
    }
    return this.hass.locale?.language;
  }

  private _renderRelativeTime(
    published: string | undefined,
  ): TemplateResult | typeof nothing {
    if (this._config.features?.show_relative_time === false) {
      return nothing;
    }
    const text = formatRelativeTime(published, this._getRelativeTimeLocale());
    if (!text) {
      return nothing;
    }
    return html`<span class="meta">${text}</span>`;
  }

  private _usesArticleIndex(
    items: RssItem[],
    features: FeaturesConfig,
    carouselActive: boolean,
  ): boolean {
    if (items.length <= 1) {
      return false;
    }
    const preset = this._config.display?.preset ?? 'compact';
    if (preset === 'list' || preset === 'magazine') {
      return false;
    }
    if (
      preset === 'ticker' &&
      this._config.animation?.enabled !== false &&
      this._config.animation?.type === 'ticker'
    ) {
      return false;
    }
    return (
      carouselActive || features.show_article_navigation !== false
    );
  }

  private _normalizeIndex(items: RssItem[]): number {
    if (items.length === 0) {
      return 0;
    }
    return (
      ((this._carouselIndex % items.length) + items.length) % items.length
    );
  }

  private _renderArticleNavigation(
    items: RssItem[],
    features: FeaturesConfig,
    enabled: boolean,
  ): TemplateResult | typeof nothing {
    if (!enabled || features.show_article_navigation === false) {
      return nothing;
    }

    const index = this._normalizeIndex(items);
    return html`
      <div class="article-nav">
        <button
          class="nav-btn"
          title="Previous article"
          ?disabled=${items.length <= 1}
          @click=${(event: Event) => {
            event.stopPropagation();
            this._goToArticle(-1, items.length);
          }}
        >
          <ha-icon icon="mdi:chevron-left"></ha-icon>
        </button>
        <span class="article-nav-position">${index + 1}/${items.length}</span>
        <button
          class="nav-btn"
          title="Next article"
          ?disabled=${items.length <= 1}
          @click=${(event: Event) => {
            event.stopPropagation();
            this._goToArticle(1, items.length);
          }}
        >
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </button>
      </div>
    `;
  }

  private _goToArticle(delta: number, count: number): void {
    if (count <= 1) {
      return;
    }
    this._carouselIndex = (this._carouselIndex + delta + count) % count;
    this._tickerPaused = true;
    this.requestUpdate();
  }

  private _getSourceOptions(): RssSourceOption[] {
    if (!this.hass) {
      return [];
    }
    return resolveSourceOptions(this.hass, this._config.feeds ?? []);
  }

  private _getSourceSelection(): string {
    const sources = this._getSourceOptions();
    const active = this._config.active_source;

    if (isAllSources(active)) {
      return ALL_SOURCES;
    }

    if (active && sources.some((source) => source.entity === active)) {
      return active;
    }

    return ALL_SOURCES;
  }

  private _getSourceLabel(sources: RssSourceOption[]): string {
    if (isAllSources(this._config.active_source)) {
      return 'All sources';
    }

    const active = sources.find(
      (source) => source.entity === this._config.active_source,
    );
    return active?.name ?? sources[0]?.name ?? 'RSS';
  }

  private _getActiveFeeds(): FeedConfig[] {
    const sources = this._getSourceOptions();
    if (sources.length === 0) {
      return [];
    }

    if (sources.length === 1) {
      return [{ entity: sources[0].entity }];
    }

    if (isAllSources(this._config.active_source)) {
      return sources.map((source) => ({ entity: source.entity }));
    }

    const active = this._config.active_source;
    if (active && sources.some((source) => source.entity === active)) {
      return [{ entity: active }];
    }

    return sources.map((source) => ({ entity: source.entity }));
  }

  private _onSourceChange(event: Event): void {
    const entity = (event.target as HTMLSelectElement).value;
    if (!entity || entity === this._config.active_source) {
      return;
    }

    this._config = mergeConfig({ ...this._config, active_source: entity });
    this._carouselIndex = 0;
    this._lastLatestKey = '';
    this._carouselSetupKey = '';
    this._fireConfigChanged();
    this.requestUpdate();
  }

  private _fireConfigChanged(): void {
    const feeds = (this._config.feeds ?? []).filter(
      (feed) => feed.entity && feed.entity.trim().length > 0,
    );
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: {
          config: {
            ...this._config,
            feeds,
          },
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _getItems(): RssItem[] {
    const maxItems = this._config.display?.max_items ?? 5;
    return mergeFeedItems(this.hass, this._getActiveFeeds(), maxItems);
  }

  private _openItem(item: RssItem): void {
    const items = this._getItems();
    const index = items.findIndex(
      (entry) =>
        (entry.link && entry.link === item.link) ||
        (!entry.link && entry.title === item.title),
    );

    if (this._config.features?.track_read_unread) {
      markRead(item.link);
      this._readVersion += 1;
    }

    const openMode = this._config.features?.open_articles_in ?? 'dialog';
    if (item.link) {
      if (openMode === 'dialog') {
        this._articleDialog = {
          url: item.link,
          title: item.title,
          summary: item.summary,
        };
      } else {
        window.open(item.link, '_blank', 'noopener,noreferrer');
      }
    }

    if (
      this._config.features?.advance_on_read !== false &&
      index >= 0 &&
      items.length > 1
    ) {
      this._carouselIndex = (index + 1) % items.length;
      this._tickerPaused = true;
      this.requestUpdate();
    }
  }

  private _closeArticleDialog(): void {
    this._articleDialog = null;
  }

  private _openArticleExternally(url?: string): void {
    const target = url ?? this._articleDialog?.url;
    if (target) {
      window.open(target, '_blank', 'noopener,noreferrer');
    }
  }

  private _renderArticleDialog(): TemplateResult | typeof nothing {
    const dialog = this._articleDialog;
    if (!dialog) {
      return nothing;
    }

    const canEmbed = canEmbedArticleUrl(dialog.url);

    return html`
      <ha-dialog
        .open=${true}
        hideActions
        @closed=${this._closeArticleDialog}
      >
        <div class="article-dialog-header">
          <div class="article-dialog-title">${dialog.title}</div>
          <ha-icon-button
            .path=${'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'}
            @click=${this._closeArticleDialog}
          ></ha-icon-button>
        </div>
        ${canEmbed
          ? html`
              <iframe
                class="article-iframe"
                src=${dialog.url}
                title=${dialog.title}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
                loading="lazy"
              ></iframe>
            `
          : html`
              <div class="article-preview">
                <p class="article-preview-note">
                  This site cannot be embedded inside Home Assistant. You can
                  read the summary below or open the full article in your
                  browser without leaving the app on mobile.
                </p>
                ${dialog.summary
                  ? html`<p class="article-preview-text">${dialog.summary}</p>`
                  : nothing}
              </div>
            `}
        <div class="article-dialog-actions">
          <button
            class="article-dialog-btn"
            @click=${this._closeArticleDialog}
          >
            Close
          </button>
          <button
            class="article-dialog-btn primary"
            @click=${() => this._openArticleExternally(dialog.url)}
          >
            Open in browser
          </button>
        </div>
      </ha-dialog>
    `;
  }

  private async _handleRefresh(): Promise<void> {
    if (this._refreshing || !this.hass) return;
    this._refreshing = true;
    const entities = getFeedEntityIds(this._getActiveFeeds());
    if (entities.length === 0) {
      return;
    }
    const before = this._snapshotEntities(entities);
    try {
      if (entities.length === 1) {
        await this.hass.callService('hass_rss', 'refresh_feed', {
          entity_id: entities[0],
        });
      } else {
        await this.hass.callService('hass_rss', 'refresh_all', {});
      }
      await this._waitForEntityRefresh(entities, before, 15000);
      const items = this._getItems();
      const newest = getNewestItem(items);
      if (newest) {
        this._carouselIndex = 0;
        this._lastLatestKey = newest.link || newest.title || '';
      }
      this.requestUpdate();
    } catch (error) {
      console.error('HASS RSS refresh failed', error);
    } finally {
      this._refreshing = false;
    }
  }

  private _snapshotEntities(
    entities: string[],
  ): Map<
    string,
    {
      state?: string;
      lastUpdated?: string;
      lastSuccess?: string;
      newestTitle?: string;
    }
  > {
    return new Map(
      entities.map((entityId) => {
        const entity = this.hass.states[entityId];
        const items = entity?.attributes?.items as RssItem[] | undefined;
        return [
          entityId,
          {
            state: entity?.state,
            lastUpdated: entity?.last_updated,
            lastSuccess: entity?.attributes?.last_success as string | undefined,
            newestTitle: items?.[0]?.title,
          },
        ];
      }),
    );
  }

  private _entitiesRefreshed(
    entities: string[],
    before: Map<
      string,
      {
        state?: string;
        lastUpdated?: string;
        lastSuccess?: string;
        newestTitle?: string;
      }
    >,
  ): boolean {
    return entities.some((entityId) => {
      const entity = this.hass.states[entityId];
      const previous = before.get(entityId);
      if (!entity || !previous) {
        return false;
      }
      const items = entity.attributes?.items as RssItem[] | undefined;
      const newestTitle = items?.[0]?.title;
      return (
        entity.state !== previous.state ||
        entity.last_updated !== previous.lastUpdated ||
        entity.attributes?.last_success !== previous.lastSuccess ||
        newestTitle !== previous.newestTitle
      );
    });
  }

  private _waitForEntityRefresh(
    entities: string[],
    before: Map<
      string,
      {
        state?: string;
        lastUpdated?: string;
        lastSuccess?: string;
        newestTitle?: string;
      }
    >,
    timeoutMs: number,
  ): Promise<void> {
    const started = Date.now();
    return new Promise((resolve) => {
      const check = (): void => {
        if (
          this._entitiesRefreshed(entities, before) ||
          Date.now() - started >= timeoutMs
        ) {
          resolve();
          return;
        }
        window.setTimeout(check, 300);
      };
      check();
    });
  }

  private _getCarouselSetupKey(): string {
    const animation = this._config?.animation ?? {};
    const display = this._config?.display ?? {};
    return [
      display.preset ?? 'compact',
      String(animation.enabled ?? false),
      animation.type ?? '',
      String(animation.interval ?? 5),
      String(this._getItems().length),
      this._getSourceSelection(),
      (this._config?.feeds ?? []).map((feed) => feed.entity).join('|'),
    ].join(':');
  }

  private _ensureCarouselTimer(): void {
    if (!this._config || !this.hass) {
      return;
    }
    const key = this._getCarouselSetupKey();
    if (key === this._carouselSetupKey && this._carouselTimer) {
      return;
    }
    this._carouselSetupKey = key;
    this._syncCarousel();
  }

  private _applyPresetDefaults(): void {
    const preset = this._config.display?.preset;
    if (!this._config.animation) this._config.animation = {};

    if (preset === 'ticker') {
      if (this._config.animation.enabled === undefined) {
        this._config.animation.enabled = true;
      }
      if (!this._config.animation.type) {
        this._config.animation.type = 'carousel';
      }
      if (!this._config.animation.interval) {
        this._config.animation.interval = 5;
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
    const preset = this._config?.display?.preset ?? 'compact';
    const supportsCarousel =
      preset === 'compact' || preset === 'ticker';

    if (
      !animation?.enabled ||
      animation.type !== 'carousel' ||
      !supportsCarousel ||
      prefersReducedMotion() ||
      items.length <= 1
    ) {
      return;
    }

    const interval = (animation.interval ?? 5) * 1000;
    this._carouselTimer = setInterval(() => {
      if (this._tickerPaused) return;
      const count = this._getItems().length;
      if (count <= 1) return;
      this._carouselIndex = (this._carouselIndex + 1) % count;
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
    void hass;
    return {
      ...DEFAULT_CONFIG,
      feeds: [],
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
    'https://github.com/il90il90/hass-rss-card#readme',
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
