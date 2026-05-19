import type { FeedConfig, HomeAssistant, RssItem } from '../types';

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

    for (const item of items) {
      allItems.push({
        ...item,
        feed_name: item.feed_name ?? feedName,
        category: item.category ?? entityCategory,
      });
    }

    if (items.length === 0 && state.state && state.state !== 'unavailable') {
      allItems.push({
        title: state.state,
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

  allItems.sort((a, b) => {
    const dateA = a.published ? Date.parse(a.published) : 0;
    const dateB = b.published ? Date.parse(b.published) : 0;
    return dateB - dateA;
  });

  const seen = new Set<string>();
  const deduped: RssItem[] = [];
  for (const item of allItems) {
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
