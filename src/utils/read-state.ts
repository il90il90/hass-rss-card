const READ_KEY = 'hass_rss_read';

function loadReadSet(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveReadSet(set: Set<string>): void {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...set].slice(-500)));
  } catch {
    // ignore storage errors
  }
}

export function isRead(link: string): boolean {
  if (!link) return false;
  return loadReadSet().has(link);
}

export function markRead(link: string): void {
  if (!link) return;
  const set = loadReadSet();
  set.add(link);
  saveReadSet(set);
}

export function isNewItem(
  published: string | undefined,
  durationSeconds: number,
  link: string,
): boolean {
  if (!published || isRead(link)) return false;
  const ts = Date.parse(published);
  if (Number.isNaN(ts)) return false;
  const ageMs = Date.now() - ts;
  return ageMs >= 0 && ageMs <= durationSeconds * 1000;
}
