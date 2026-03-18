#!/usr/bin/env python3
"""
crawl.py — Internal Link Score (ILS) calculator

findemergencyvet.com URL structure:
  /                        → homepage
  /locations/              → national hub (index)
  /[state]/                → state hub  e.g. /florida/
  /[state]/[city]/         → city page  e.g. /florida/gainesville/
  /clinics/[slug]/         → clinic profile
  /about/ /costs/ /triage/ /guides/ → utility (ignored)

Legacy redirects (handled by next.config.ts, crawler won't see these):
  /locations/[state-abbr]/[city] → /{state}/{city}

Usage:
    python3 crawl.py --url http://localhost:3000 --output results/
    python3 crawl.py --url https://findemergencyvet.com --output results/ --live
"""

import argparse
import json
import os
import time
from collections import defaultdict, deque
from datetime import datetime, timezone
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup


# ── Config ─────────────────────────────────────────────────────────────────

MAX_PAGES        = 2000
CRAWL_DELAY      = 0.1
MAX_DEPTH        = 8
PAGERANK_ITERS   = 50
PAGERANK_DAMPING = 0.85

# Pages that are NOT state slugs at the root level
UTILITY_SLUGS = {
    "about", "costs", "triage", "guides", "locations",
    "clinics", "api", "sitemap.xml", "favicon.ico",
    "_next", "contact", "privacy",
}

# Known state slugs — used to distinguish /{state}/{city} from /clinics/{slug}
# Full list so the classifier is unambiguous
US_STATE_SLUGS = {
    "alabama", "alaska", "arizona", "arkansas", "california",
    "colorado", "connecticut", "delaware", "florida", "georgia",
    "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas",
    "kentucky", "louisiana", "maine", "maryland", "massachusetts",
    "michigan", "minnesota", "mississippi", "missouri", "montana",
    "nebraska", "nevada", "new-hampshire", "new-jersey", "new-mexico",
    "new-york", "north-carolina", "north-dakota", "ohio", "oklahoma",
    "oregon", "pennsylvania", "rhode-island", "south-carolina",
    "south-dakota", "tennessee", "texas", "utah", "vermont",
    "virginia", "washington", "west-virginia", "wisconsin", "wyoming",
    "washington-dc",
}


# ── Helpers ─────────────────────────────────────────────────────────────────

def normalise(url, base):
    parsed = urlparse(urljoin(base, url))
    return parsed._replace(fragment="", query="").geturl()


def is_internal(url, base_domain):
    return urlparse(url).netloc == base_domain


# ── Classifier ───────────────────────────────────────────────────────────────

def classify(path):
    parts = [p for p in path.strip("/").split("/") if p]

    # Homepage
    if not parts:
        return "homepage"

    slug0 = parts[0]

    # Utility / ignored pages
    if slug0 in UTILITY_SLUGS and slug0 not in US_STATE_SLUGS:
        # /locations/ = national hub
        if slug0 == "locations":
            return "national_hub"
        # /clinics/[slug]/ = clinic profile
        if slug0 == "clinics" and len(parts) == 2:
            return "clinic"
        if slug0 == "clinics":
            return "national_hub"
        return "other"

    # State hub: /florida/
    if slug0 in US_STATE_SLUGS and len(parts) == 1:
        return "state_hub"

    # City page: /florida/gainesville/
    if slug0 in US_STATE_SLUGS and len(parts) == 2:
        return "city"

    # Deeper under a state (shouldn't exist but handle gracefully)
    if slug0 in US_STATE_SLUGS and len(parts) > 2:
        return "other"

    return "other"


# ── Crawler ──────────────────────────────────────────────────────────────────

def crawl(base_url, max_pages=MAX_PAGES, delay=CRAWL_DELAY):
    base_domain = urlparse(base_url).netloc
    visited     = {}
    adjacency   = defaultdict(set)
    queue       = deque([(base_url, 0)])
    session     = requests.Session()
    session.headers.update({"User-Agent": "ils-crawler/1.0 (internal audit)"})

    print(f"\n🕷  Crawling {base_url} ...")

    while queue and len(visited) < max_pages:
        url, depth = queue.popleft()
        if url in visited or depth > MAX_DEPTH:
            continue
        try:
            resp = session.get(url, timeout=10)
            if resp.status_code != 200:
                continue
            if "text/html" not in resp.headers.get("content-type", ""):
                continue
        except Exception as e:
            print(f"  ⚠  {url}: {e}")
            continue

        soup  = BeautifulSoup(resp.text, "html.parser")
        links = []
        for tag in soup.find_all("a", href=True):
            href = normalise(tag["href"], url)
            if is_internal(href, base_domain):
                links.append(href)
                adjacency[url].add(href)
                if href not in visited:
                    queue.append((href, depth + 1))

        path = urlparse(url).path
        visited[url] = {
            "depth":     depth,
            "links_out": links,
            "links_in":  0,
            "type":      classify(path),
            "path":      path,
        }
        if len(visited) % 50 == 0:
            print(f"  … {len(visited)} pages crawled")
        time.sleep(delay)

    for src, targets in adjacency.items():
        for tgt in targets:
            if tgt in visited:
                visited[tgt]["links_in"] = visited[tgt].get("links_in", 0) + 1

    print(f"  ✓ Done. {len(visited)} pages found.\n")
    return visited, dict(adjacency)


# ── Metrics ──────────────────────────────────────────────────────────────────

def score_crawl_depth(pages):
    total   = len(pages)
    if total == 0:
        return 0, {}
    within3 = sum(1 for p in pages.values() if p["depth"] <= 3)
    pct     = within3 / total
    score   = round(pct * 40, 2)
    return score, {"total_pages": total, "within_3_clicks": within3,
                   "pct_within_3": round(pct * 100, 1), "score": score}


def score_orphan_rate(pages):
    total   = len(pages)
    if total == 0:
        return 0, {}
    orphans = [u for u, p in pages.items()
               if p.get("links_in", 0) == 0 and p["type"] != "homepage"]
    rate    = len(orphans) / total
    score   = max(0, round((1 - (rate / 0.20)) * 30, 2))
    return score, {"total_pages": total, "orphan_count": len(orphans),
                   "orphan_rate": round(rate * 100, 1),
                   "sample_orphans": orphans[:10], "score": score}


def compute_pagerank(pages, adjacency, iters=PAGERANK_ITERS, d=PAGERANK_DAMPING):
    urls = list(pages.keys())
    n    = len(urls)
    if n == 0:
        return {}
    pr = {u: 1.0 / n for u in urls}
    for _ in range(iters):
        new_pr = {}
        for u in urls:
            s = sum(pr.get(src, 0) / len(tgts)
                    for src, tgts in adjacency.items()
                    if u in tgts and tgts)
            new_pr[u] = (1 - d) / n + d * s
        pr = new_pr
    return pr


def gini(values):
    if not values:
        return 0
    vals  = sorted(values)
    n     = len(vals)
    total = sum(vals)
    if total == 0:
        return 0
    numer = 2 * sum((i + 1) * v for i, v in enumerate(vals))
    return round((numer / (n * total)) - (n + 1) / n, 4)


def score_pagerank_distribution(pages, adjacency):
    pr    = compute_pagerank(pages, adjacency)
    g     = gini(list(pr.values()))
    score = round((1 - g) * 20, 2)
    top10 = sorted(pr.items(), key=lambda x: x[1], reverse=True)[:10]
    return score, {"gini_coefficient": g,
                   "top_10_pages": [(u, round(v, 6)) for u, v in top10],
                   "score": score}


def score_hub_connectivity(pages, adjacency):
    state_hubs = {u: p for u, p in pages.items() if p["type"] == "state_hub"}
    city_pages = {u: p for u, p in pages.items() if p["type"] == "city"}

    if not state_hubs or not city_pages:
        return 5, {"note": "Not enough state/city pages found.",
                   "state_hub_count": len(state_hubs),
                   "city_page_count": len(city_pages)}

    city_backlink = hub_to_city = total = 0
    for city_url, city_data in city_pages.items():
        parts = [p for p in city_data["path"].strip("/").split("/") if p]
        if len(parts) < 2:
            continue
        state = parts[0]
        # Find the matching state hub: /{state}/
        hub_url = next(
            (hu for hu in state_hubs
             if urlparse(hu).path.strip("/") == state),
            None
        )
        if not hub_url:
            continue
        total += 1
        if hub_url in adjacency.get(city_url, set()):
            city_backlink += 1
        if city_url in adjacency.get(hub_url, set()):
            hub_to_city += 1

    if total == 0:
        return 5, {"note": "Could not match city pages to state hubs.",
                   "state_hub_count": len(state_hubs),
                   "city_page_count": len(city_pages)}

    combined = ((hub_to_city / total) + (city_backlink / total)) / 2
    score    = round(combined * 10, 2)
    return score, {
        "total_city_pages_checked": total,
        "hub_links_to_city_pct":    round(hub_to_city / total * 100, 1),
        "city_links_to_hub_pct":    round(city_backlink / total * 100, 1),
        "score":                    score,
    }


# ── Main ─────────────────────────────────────────────────────────────────────

def run(base_url, output_dir=None, live=False):
    delay = 0.5 if live else CRAWL_DELAY
    pages, adjacency = crawl(base_url, delay=delay)

    s1, d1 = score_crawl_depth(pages)
    s2, d2 = score_orphan_rate(pages)
    s3, d3 = score_pagerank_distribution(pages, adjacency)
    s4, d4 = score_hub_connectivity(pages, adjacency)
    total  = round(s1 + s2 + s3 + s4, 2)

    type_keys = ["homepage", "national_hub", "state_hub", "city", "clinic", "other"]

    report = {
        "url":       base_url,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "ILS":       total,
        "breakdown": {
            "crawl_depth":           {"score": s1, "max": 40, "detail": d1},
            "orphan_rate":           {"score": s2, "max": 30, "detail": d2},
            "pagerank_distribution": {"score": s3, "max": 20, "detail": d3},
            "hub_connectivity":      {"score": s4, "max": 10, "detail": d4},
        },
        "page_count": len(pages),
        "page_types": {t: sum(1 for p in pages.values() if p["type"] == t)
                       for t in type_keys},
    }

    print("=" * 50)
    print(f"  INTERNAL LINK SCORE (ILS): {total} / 100")
    print("=" * 50)
    print(f"  Crawl depth score:      {s1:5.1f} / 40")
    print(f"  Orphan rate score:      {s2:5.1f} / 30")
    print(f"  PageRank distribution:  {s3:5.1f} / 20")
    print(f"  Hub connectivity:       {s4:5.1f} / 10")
    print("-" * 50)
    print(f"  Pages crawled: {len(pages)}")
    print(f"  Page types:    {report['page_types']}")

    if d2.get("orphan_count"):
        print(f"\n  ⚠  {d2['orphan_count']} orphan pages ({d2['orphan_rate']}%)")
        for u in d2.get("sample_orphans", []):
            print(f"     - {u}")

    print()

    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        fname = os.path.join(output_dir, "latest.json")
        with open(fname, "w") as f:
            json.dump(report, f, indent=2)
        print(f"  📄 Report saved to {fname}")
        ts    = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        tname = os.path.join(output_dir, f"run_{ts}.json")
        with open(tname, "w") as f:
            json.dump(report, f, indent=2)

    return report


# ── CLI ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Internal Link Score crawler")
    parser.add_argument("--url",    required=True)
    parser.add_argument("--output", default=None)
    parser.add_argument("--live",   action="store_true")
    args = parser.parse_args()
    run(args.url, output_dir=args.output, live=args.live)
