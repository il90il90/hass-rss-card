import re
import sys
import urllib.request

url = sys.argv[1] if len(sys.argv) > 1 else "http://mako.co.il/rss"
req = urllib.request.Request(
    url,
    headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},
)
html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")
patterns = [
    r"https?://rcs\.mako\.co\.il/rss/[a-z0-9]+\.xml",
    r"https?://[^\"'\s]+\.xml",
    r"xmlUrl=[\"']([^\"']+)[\"']",
]
found = set()
for pat in patterns:
    for m in re.findall(pat, html):
        found.add(m if isinstance(m, str) else m[0])
for u in sorted(found):
    if "mako" in u.lower() or "rss" in u.lower():
        print(u)
