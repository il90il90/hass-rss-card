import type { HassRssCardConfig } from './types';

export function mergeConfig(config: HassRssCardConfig): HassRssCardConfig {
  return {
    ...DEFAULT_CONFIG,
    ...config,
    display: {
      ...DEFAULT_CONFIG.display,
      ...config.display,
      image: {
        ...DEFAULT_CONFIG.display?.image,
        ...config.display?.image,
      },
    },
    animation: {
      ...DEFAULT_CONFIG.animation,
      ...config.animation,
    },
    features: {
      ...DEFAULT_CONFIG.features,
      ...config.features,
    },
  };
}

export const DEFAULT_CONFIG: HassRssCardConfig = {
  feeds: [],
  display: {
    preset: 'compact',
    show: 'title_image',
    max_items: 5,
    image: {
      position: 'start',
      size: 'medium',
      fit: 'cover',
      fallback: 'none',
    },
  },
  animation: {
    enabled: false,
    type: 'carousel',
    speed_preset: 'medium',
    speed: 50,
    interval: 5,
    transition: 'fade',
    pause_on_hover: true,
  },
  features: {
    show_relative_time: true,
    show_new_badge: true,
    new_badge_duration: 3600,
    show_refresh_button: true,
    track_read_unread: true,
  },
  always_show_latest: true,
  rtl: 'auto',
  tap_action: { action: 'url' },
};
