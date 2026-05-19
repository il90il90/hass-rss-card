import { css, html, LitElement, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { mergeConfig } from './config-defaults';
import type { FeedConfig, HassRssCardConfig, HomeAssistant } from './types';
import { showIncludesImage } from './types';
import { listRssSensorEntities } from './utils/rss-entities';

@customElement('hass-rss-card-editor')
export class HassRssCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config!: HassRssCardConfig;

  static styles = css`
    .section {
      margin-top: 8px;
      border-top: 1px solid var(--divider-color);
      padding-top: 8px;
    }
    .section-title {
      font-size: 1.1em;
      font-weight: 500;
      margin-bottom: 8px;
    }
    .section-help {
      margin: 0 0 12px;
      font-size: 0.85em;
      opacity: 0.8;
      line-height: 1.4;
    }
    .feed-row {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    .feed-row ha-entity-picker {
      flex: 1;
    }
    .add-btn {
      margin-top: 4px;
    }
  `;

  public setConfig(config: HassRssCardConfig): void {
    this._config = mergeConfig(config);
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html``;

    return html`
      ${this._renderSources()}
      ${this._renderDisplay()}
      ${this._renderAnimation()}
      ${this._renderFeatures()}
      ${this._renderLayout()}
    `;
  }

  private _renderSources(): TemplateResult {
    const feeds = this._config.feeds ?? [];
    const rssEntities = this._getRssEntities();
    const sourceOptions = listRssSensorEntities(this.hass);

    return html`
      <div class="section">
        <div class="section-title">Sources</div>
        <p class="section-help">
          Limit which RSS sensors this card can use. Leave empty to allow every
          HASS RSS sensor and switch between them from the card header.
          To add a new RSS URL, go to Settings → Devices &amp; Services → HASS RSS.
        </p>
        ${feeds.length === 0
          ? html`
              <p class="section-help">
                No sources pinned yet. The card will list all
                ${sourceOptions.length} available RSS sensors.
              </p>
            `
          : ''}
        ${feeds.map(
          (feed, index) => html`
            <div class="feed-row">
              <ha-entity-picker
                .hass=${this.hass}
                .label=${'RSS sensor'}
                .value=${feed.entity}
                .includeEntities=${rssEntities}
                .allowCustomEntity=${false}
                @value-changed=${(ev: CustomEvent) =>
                  this._updateFeed(index, 'entity', ev.detail.value)}
              ></ha-entity-picker>
              <ha-textfield
                label="Category filter"
                .value=${feed.category ?? ''}
                @input=${(ev: Event) =>
                  this._updateFeed(
                    index,
                    'category',
                    (ev.target as HTMLInputElement).value,
                  )}
              ></ha-textfield>
              ${feeds.length > 1
                ? html`
                    <ha-icon-button
                      .path=${'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z'}
                      @click=${() => this._removeFeed(index)}
                    ></ha-icon-button>
                  `
                : ''}
            </div>
          `,
        )}
        <ha-button class="add-btn" @click=${this._addFeed}>Add another source</ha-button>
        ${this._renderActiveSourcePicker(sourceOptions)}
      </div>
    `;
  }

  private _renderActiveSourcePicker(
    sourceOptions: { entity: string; name: string }[],
  ): TemplateResult | typeof import('lit').nothing {
    if (sourceOptions.length <= 1) {
      return html``;
    }

    const configured = (this._config.feeds ?? []).filter((feed) => feed.entity?.trim());
    const options =
      configured.length > 0
        ? configured.map((feed) => {
            const match = sourceOptions.find((option) => option.entity === feed.entity);
            return (
              match ?? {
                entity: feed.entity,
                name: feed.entity,
              }
            );
          })
        : sourceOptions;

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{ active_source: this._config.active_source ?? options[0]?.entity }}
        .schema=${[
          {
            name: 'active_source',
            selector: {
              select: {
                mode: 'dropdown',
                options: options.map((option) => ({
                  value: option.entity,
                  label: option.name,
                })),
              },
            },
          },
        ]}
        @value-changed=${(ev: CustomEvent) =>
          this._updateConfig('active_source', ev.detail.value.active_source)}
      ></ha-form>
    `;
  }

  private _renderDisplay(): TemplateResult {
    const display = this._config.display ?? {};
    const showImage = showIncludesImage(display.show);

    return html`
      <div class="section">
        <div class="section-title">Display</div>
        <ha-form
          .hass=${this.hass}
          .data=${display}
          .schema=${[
            {
              name: 'preset',
              selector: {
                select: {
                  options: [
                    { value: 'compact', label: 'Compact' },
                    { value: 'ticker', label: 'Ticker' },
                    { value: 'card', label: 'Card' },
                    { value: 'list', label: 'List' },
                    { value: 'magazine', label: 'Magazine' },
                  ],
                },
              },
            },
            {
              name: 'show',
              selector: {
                select: {
                  options: [
                    { value: 'title', label: 'Title' },
                    { value: 'title_summary', label: 'Title + Summary' },
                    { value: 'title_image', label: 'Title + Image' },
                    {
                      value: 'title_image_summary',
                      label: 'Title + Image + Summary',
                    },
                  ],
                },
              },
            },
            {
              name: 'max_items',
              selector: { number: { min: 1, max: 50, step: 1 } },
            },
            ...(showImage
              ? [
                  {
                    type: 'expandable' as const,
                    name: 'image',
                    title: 'Image',
                    schema: [
                      {
                        name: 'position',
                        selector: {
                          select: {
                            options: [
                              { value: 'start', label: 'Start' },
                              { value: 'end', label: 'End' },
                              { value: 'top', label: 'Top' },
                            ],
                          },
                        },
                      },
                      {
                        name: 'size',
                        selector: {
                          select: {
                            options: [
                              { value: 'small', label: 'Small' },
                              { value: 'medium', label: 'Medium' },
                              { value: 'large', label: 'Large' },
                            ],
                          },
                        },
                      },
                      {
                        name: 'fit',
                        selector: {
                          select: {
                            options: [
                              { value: 'cover', label: 'Cover' },
                              { value: 'contain', label: 'Contain' },
                            ],
                          },
                        },
                      },
                      {
                        name: 'fallback',
                        selector: {
                          select: {
                            options: [
                              { value: 'none', label: 'No placeholder' },
                              { value: 'placeholder', label: 'Placeholder icon' },
                            ],
                          },
                        },
                      },
                    ],
                  },
                ]
              : []),
          ]}
          @value-changed=${(ev: CustomEvent) =>
            this._updateConfig('display', {
              ...display,
              ...ev.detail.value,
            })}
        ></ha-form>
      </div>
    `;
  }

  private _renderAnimation(): TemplateResult {
    const animation = this._config.animation ?? {};
    const enabled = animation.enabled ?? false;
    const isTickerScroll = animation.type === 'ticker';
    const isCarousel = animation.type === 'carousel';
    const isCustomSpeed = animation.speed_preset === 'custom';

    const schema = [
      { name: 'enabled', selector: { boolean: {} } },
      ...(enabled
        ? [
            {
              name: 'type',
              selector: {
                select: {
                  options: [
                    { value: 'carousel', label: 'Rotate headlines' },
                    { value: 'ticker', label: 'Continuous scroll' },
                  ],
                },
              },
            },
          ]
        : []),
      ...(enabled && isCarousel
        ? [
            {
              name: 'interval',
              selector: {
                number: { min: 3, max: 60, step: 1, unit_of_measurement: 's' },
              },
            },
            {
              name: 'transition',
              selector: {
                select: {
                  options: [
                    { value: 'fade', label: 'Fade' },
                    { value: 'slide', label: 'Slide' },
                    { value: 'none', label: 'None' },
                  ],
                },
              },
            },
          ]
        : []),
      ...(enabled && isTickerScroll
        ? [
            {
              name: 'speed_preset',
              selector: {
                select: {
                  options: [
                    { value: 'slow', label: 'Slow (30 px/s)' },
                    { value: 'medium', label: 'Medium (50 px/s)' },
                    { value: 'fast', label: 'Fast (80 px/s)' },
                    { value: 'custom', label: 'Custom' },
                  ],
                },
              },
            },
            ...(isCustomSpeed
              ? [
                  {
                    name: 'speed',
                    selector: {
                      number: {
                        min: 20,
                        max: 120,
                        step: 5,
                        unit_of_measurement: 'px/s',
                      },
                    },
                  },
                ]
              : []),
          ]
        : []),
      ...(enabled
        ? [{ name: 'pause_on_hover', selector: { boolean: {} } }]
        : []),
    ];

    return html`
      <div class="section">
        <div class="section-title">Animation</div>
        <ha-form
          .hass=${this.hass}
          .data=${animation}
          .schema=${schema}
          @value-changed=${(ev: CustomEvent) =>
            this._updateConfig('animation', {
              ...animation,
              ...ev.detail.value,
            })}
        ></ha-form>
      </div>
    `;
  }

  private _renderFeatures(): TemplateResult {
    const features = this._config.features ?? {};

    return html`
      <div class="section">
        <div class="section-title">Features</div>
        <ha-form
          .hass=${this.hass}
          .data=${features}
          .schema=${[
            { name: 'show_relative_time', selector: { boolean: {} } },
            { name: 'show_last_updated', selector: { boolean: {} } },
            { name: 'show_new_badge', selector: { boolean: {} } },
            {
              name: 'new_badge_duration',
              selector: {
                number: { min: 300, max: 86400, step: 300, unit_of_measurement: 's' },
              },
            },
            { name: 'show_refresh_button', selector: { boolean: {} } },
            { name: 'show_source_selector', selector: { boolean: {} } },
            { name: 'track_read_unread', selector: { boolean: {} } },
          ]}
          @value-changed=${(ev: CustomEvent) =>
            this._updateConfig('features', {
              ...features,
              ...ev.detail.value,
            })}
        ></ha-form>
      </div>
    `;
  }

  private _renderLayout(): TemplateResult {
    return html`
      <div class="section">
        <div class="section-title">Layout</div>
        <ha-form
          .hass=${this.hass}
          .data=${{
            rtl: this._config.rtl,
            always_show_latest: this._config.always_show_latest,
          }}
          .schema=${[
            {
              name: 'rtl',
              selector: {
                select: {
                  options: [
                    { value: 'auto', label: 'Auto' },
                    { value: 'true', label: 'RTL' },
                    { value: 'false', label: 'LTR' },
                  ],
                },
              },
            },
            { name: 'always_show_latest', selector: { boolean: {} } },
          ]}
          @value-changed=${(ev: CustomEvent) => {
            this._updateConfig('rtl', ev.detail.value.rtl);
            this._updateConfig(
              'always_show_latest',
              ev.detail.value.always_show_latest,
            );
          }}
        ></ha-form>
      </div>
    `;
  }

  private _getRssEntities(): string[] {
    return Object.keys(this.hass.states).filter((entityId) => {
      const state = this.hass.states[entityId];
      return (
        entityId.startsWith('sensor.') &&
        state.attributes?.feed_name !== undefined
      );
    });
  }

  private _addFeed(): void {
    const feeds = [...(this._config.feeds ?? []), { entity: '' }];
    this._config = { ...this._config, feeds };
    this._dispatchConfig();
  }

  private _removeFeed(index: number): void {
    const feeds = [...(this._config.feeds ?? [])];
    feeds.splice(index, 1);
    this._config = { ...this._config, feeds: feeds.length ? feeds : [] };
    this._dispatchConfig();
  }

  private _updateFeed(
    index: number,
    key: 'entity' | 'category',
    value: string,
  ): void {
    const feeds = [...(this._config.feeds ?? [])];
    feeds[index] = { ...feeds[index], [key]: value };
    this._config = { ...this._config, feeds };
    this._dispatchConfig();
  }

  private _updateConfig(key: keyof HassRssCardConfig, value: unknown): void {
    this._config = { ...this._config, [key]: value };
    this._dispatchConfig();
  }

  private _dispatchConfig(): void {
    const feeds = (this._config.feeds ?? []).filter(
      (feed): feed is FeedConfig =>
        typeof feed === 'object' &&
        feed !== null &&
        typeof feed.entity === 'string' &&
        feed.entity.trim().length > 0,
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
}

declare global {
  interface HTMLElementTagNameMap {
    'hass-rss-card-editor': HassRssCardEditor;
  }
}
