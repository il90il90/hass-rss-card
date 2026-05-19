const IFRAME_BLOCKED_HOSTS = [
  'ynet.co.il',
  'walla.co.il',
  'haaretz.co.il',
  'calcalist.co.il',
  'israelhayom.co.il',
  'timesofisrael.com',
  'n12.co.il',
  'kan.org.il',
];

export function canEmbedArticleUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    return !IFRAME_BLOCKED_HOSTS.some(
      (blocked) => hostname === blocked || hostname.endsWith(`.${blocked}`),
    );
  } catch {
    return false;
  }
}
