import type { FeedConfig, HomeAssistant } from '../types';

export const ALL_SOURCES = '__all__';

export interface RssSourceOption {
  entity: string;
  name: string;
}

export function getFeedLabel(
  hass: HomeAssistant,
  entityId: string,
): string {
  const attrs = hass.states[entityId]?.attributes;
  return String(attrs?.feed_name ?? entityId);
}

export function listRssSensorEntities(hass: HomeAssistant): RssSourceOption[] {
  return Object.keys(hass.states)
    .filter(
      (entityId) =>
        entityId.startsWith('sensor.') &&
        hass.states[entityId]?.attributes?.feed_name !== undefined,
    )
    .map((entityId) => ({
      entity: entityId,
      name: getFeedLabel(hass, entityId),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function resolveSourceOptions(
  hass: HomeAssistant,
  configuredFeeds: FeedConfig[],
): RssSourceOption[] {
  const configured = configuredFeeds.filter((feed) => feed.entity?.trim());
  if (configured.length > 0) {
    return configured.map((feed) => ({
      entity: feed.entity,
      name: getFeedLabel(hass, feed.entity),
    }));
  }
  return listRssSensorEntities(hass);
}

export function isAllSources(activeSource?: string): boolean {
  return !activeSource || activeSource === ALL_SOURCES;
}
