import type { FeedConfig, HomeAssistant, RssItem } from '../types';

export function parseItemTimestamp(item: RssItem): number {
  if (!item.published) return 0;
  const timestamp = Date.parse(item.published);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function sortItemsNewestFirst(items: RssItem[]): RssItem[] {
  return [...items].sort(
    (a, b) => parseItemTimestamp(b) - parseItemTimestamp(a),
  );
}

export function mergeFeedItems(
  hass: HomeAssistant,
  feeds: FeedConfig[],
  maxItems: number,
): RssItem[] {
  const allItems: RssItem[] = [];

  for (const feed of feeds) {
    const state = hass.states[feed.entity];
    if (!state) continue;

    const attrs = state.attributes ?? {};
    const entityCategory = (attrs.category as string) ?? '';

    if (feed.category && feed.category !== entityCategory) {
      continue;
    }

    const items = (attrs.items as RssItem[] | undefined) ?? [];
    const feedName = (attrs.feed_name as string) ?? feed.entity;
    const latestHeadline = state.state && state.state !== 'unavailable'
      ? state.state
      : '';

    for (const item of items) {
      const normalized = {
        ...item,
        feed_name: item.feed_name ?? feedName,
        category: item.category ?? entityCategory,
      };
      if (
        latestHeadline &&
        normalized.title === latestHeadline &&
        parseItemTimestamp(normalized) === 0
      ) {
        normalized.published =
          normalized.published ?? (attrs.published as string | undefined);
      }
      allItems.push(normalized);
    }

    if (items.length === 0 && latestHeadline) {
      allItems.push({
        title: latestHeadline,
        link: (attrs.link as string) ?? '',
        published: attrs.published as string | undefined,
        summary: attrs.summary as string | undefined,
        image: attrs.image as string | null | undefined,
        has_image: attrs.has_image as boolean | undefined,
        feed_name: feedName,
        category: entityCategory,
      });
    }
  }

  const sorted = sortItemsNewestFirst(allItems);

  const seen = new Set<string>();
  const deduped: RssItem[] = [];
  for (const item of sorted) {
    const key = item.link || item.guid || item.title;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  return deduped.slice(0, maxItems);
}

export function getFeedEntityIds(feeds: FeedConfig[]): string[] {
  return feeds.map((f) => f.entity);
}

export function getNewestItem(items: RssItem[]): RssItem | undefined {
  return sortItemsNewestFirst(items)[0];
}
