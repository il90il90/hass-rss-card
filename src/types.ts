export interface RssItem {
  title: string;
  link: string;
  published?: string;
  summary?: string;
  image?: string | null;
  has_image?: boolean;
  guid?: string;
  feed_name?: string;
  category?: string;
}

export interface FeedConfig {
  entity: string;
  category?: string;
}

export type DisplayPreset = 'compact' | 'ticker' | 'card' | 'list' | 'magazine';
export type ShowMode =
  | 'title'
  | 'title_summary'
  | 'title_image'
  | 'title_image_summary';
export type ImagePosition = 'start' | 'end' | 'top';
export type ImageSize = 'small' | 'medium' | 'large';
export type ImageFallback = 'none' | 'placeholder';
export type AnimationType = 'ticker' | 'carousel';
export type SpeedPreset = 'slow' | 'medium' | 'fast' | 'custom';
export type TransitionType = 'fade' | 'slide' | 'none';
export type RtlMode = 'auto' | 'true' | 'false';

export interface ImageConfig {
  position?: ImagePosition;
  size?: ImageSize;
  fit?: 'cover' | 'contain';
  fallback?: ImageFallback;
}

export interface AnimationConfig {
  enabled?: boolean;
  type?: AnimationType;
  speed_preset?: SpeedPreset;
  speed?: number;
  interval?: number;
  transition?: TransitionType;
  pause_on_hover?: boolean;
}

export interface FeaturesConfig {
  show_relative_time?: boolean;
  show_new_badge?: boolean;
  new_badge_duration?: number;
  show_refresh_button?: boolean;
  show_source_selector?: boolean;
  show_last_updated?: boolean;
  show_article_navigation?: boolean;
  advance_on_read?: boolean;
  track_read_unread?: boolean;
}

export interface DisplayConfig {
  preset?: DisplayPreset;
  show?: ShowMode;
  max_items?: number;
  image?: ImageConfig;
}

export interface HassRssCardConfig {
  type?: string;
  feeds?: FeedConfig[];
  active_source?: string;
  display?: DisplayConfig;
  animation?: AnimationConfig;
  features?: FeaturesConfig;
  always_show_latest?: boolean;
  rtl?: RtlMode;
  tap_action?: Record<string, unknown>;
}

export interface HassEntity {
  state: string;
  last_updated?: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ): Promise<void>;
  locale?: { language: string };
}

export const SPEED_PRESET_VALUES: Record<SpeedPreset, number> = {
  slow: 30,
  medium: 50,
  fast: 80,
  custom: 50,
};

export function showIncludesImage(show?: ShowMode): boolean {
  return show === 'title_image' || show === 'title_image_summary';
}

export function showIncludesSummary(show?: ShowMode): boolean {
  return show === 'title_summary' || show === 'title_image_summary';
}
