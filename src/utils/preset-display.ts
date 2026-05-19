import type { DisplayConfig, DisplayPreset } from '../types';

const PRESET_DISPLAY: Record<
  DisplayPreset,
  Partial<DisplayConfig> & { image?: DisplayConfig['image'] }
> = {
  compact: {},
  ticker: {
    max_items: 5,
  },
  card: {
    show: 'title_image_summary',
    max_items: 5,
    image: {
      position: 'top',
      size: 'large',
      fit: 'cover',
      fallback: 'placeholder',
    },
  },
  list: {
    show: 'title_image',
    max_items: 10,
    image: {
      position: 'start',
      size: 'medium',
      fit: 'cover',
      fallback: 'none',
    },
  },
  magazine: {
    show: 'title_image',
    max_items: 5,
    image: {
      position: 'top',
      size: 'large',
      fit: 'cover',
      fallback: 'none',
    },
  },
};

export function resolvePresetDisplay(
  preset: DisplayPreset,
  display: DisplayConfig = {},
): DisplayConfig {
  const defaults = PRESET_DISPLAY[preset] ?? {};
  return {
    ...display,
    show: display.show ?? defaults.show,
    max_items: display.max_items ?? defaults.max_items,
    image: {
      ...defaults.image,
      ...display.image,
      ...(preset === 'card' ? { position: 'top' as const } : {}),
    },
  };
}

export function presetUsesImages(preset: DisplayPreset): boolean {
  return preset === 'card' || preset === 'magazine' || preset === 'list';
}
