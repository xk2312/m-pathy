import asyncio
import json
import os
import re
import textwrap
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Any, Optional
from urllib.parse import urljoin
from xml.etree import ElementTree as ET

import httpx


# ============================================================
# AI News Column Agent
# ============================================================
# Goal:
# 1. Visit 13 AI news sources.
# 2. Pull the 3 most relevant AI news items from each source.
# 3. Produce 39 ordered summaries, with the most important first.
# 4. Generate a high-quality, accessible, witty column draft.
#
# Notes:
# - Uses RSS where available because it is more stable and respectful.
# - Can use OpenAI-compatible chat completions for ranking and writing.
# - Falls back to heuristic ranking if no model key is present.
# - Intended for your own site workflow, not for hidden automation.
#
# Environment:
# OPENAI_API_KEY=...
# OPENAI_BASE_URL=https://api.openai.com/v1
# OPENAI_MODEL=gpt-4.1-mini
#
# Run:
# python ai_news_column_agent.py
# ============================================================


USER_AGENT = (
    "m-pathy-ai-news-column-agent/1.0 "
    "(+https://m-pathy.ai; contact: editorial@m-pathy.ai)"
)

MAX_ITEMS_PER_SOURCE = 3
REQUEST_TIMEOUT = 20.0
OUTPUT_DIR = "./agent_output"


@dataclass
class Source:
    key: str
    name: str
    homepage: str
    rss_url: str


@dataclass
class RawItem:
    source_key: str
    source_name: str
    title: str
    url: str
    published_at: Optional[str]
    summary: str


@dataclass
class RankedItem:
    source_key: str
    source_name: str
    title: str
    url: str
    published_at: Optional[str]
    source_summary: str
    relevance_score: int
    importance_score: int
    human_impact_score: int
    business_impact_score: int
    why_it_matters: str
    audience_summary: str
    category: str


SOURCES: list[Source] = [
    Source("mit_tech_review", "MIT Technology Review", "https://www.technologyreview.com", "https://www.technologyreview.com/feed/"),
    Source("venturebeat", "VentureBeat AI", "https://venturebeat.com/ai/", "https://venturebeat.com/category/ai/feed/"),
    Source("the_batch", "The Batch", "https://www.deeplearning.ai/the-batch/", "https://www.deeplearning.ai/the-batch/feed/"),
    Source("ai_business", "AI Business", "https://aibusiness.com", "https://aibusiness.com/rss.xml"),
    Source("synced", "Synced", "https://syncedreview.com", "https://syncedreview.com/feed/"),
    Source("techcrunch_ai", "TechCrunch AI", "https://techcrunch.com/category/artificial-intelligence/", "https://techcrunch.com/category/artificial-intelligence/feed/"),
    Source("the_information", "The Information", "https://www.theinformation.com", "https://www.theinformation.com/feed"),
    Source("wired_ai", "Wired AI", "https://www.wired.com/tag/artificial-intelligence/", "https://www.wired.com/feed/tag/ai/latest/rss"),
    Source("ars_technica_ai", "Ars Technica AI", "https://arstechnica.com/ai/", "https://feeds.arstechnica.com/arstechnica/technology-lab"),
    Source("arxiv_cs_ai", "arXiv AI", "https://arxiv.org/list/cs.AI/recent", "http://export.arxiv.org/rss/cs.AI"),
    Source("papers_with_code", "Papers with Code", "https://paperswithcode.com", "https://paperswithcode.com/rss/latest"),
    Source("deepmind_blog", "DeepMind Blog", "https://deepmind.google/discover/blog/", "https://deepmind.google/discover/blog/rss.xml"),
    Source("openai_blog", "OpenAI Blog", "https://openai.com/news/", "https://openai.com/news/rss.xml"),
]


def ensure_output_dir() -> None:
    os.makedirs(OUTPUT_DIR, exist_ok=True)


def clean_html(text: str) -> str:
    text = re.sub(r"<script[\\s\\S]*?</script>", " ", text, flags=re.IGNORECASE)
    text = re.sub(r"<style[\\s\\S]*?</style>", " ", text, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def normalize_url(base: str, href: str) -> str:
    return urljoin(base, href)


def parse_datetime(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        return parsedate_to_datetime(value).astimezone(timezone.utc)
    except Exception:
        try:
            return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)
        except Exception:
            return None


def to_iso(value: Optional[datetime]) -> Optional[str]:
    return value.isoformat() if value else None


async def fetch_text(client: httpx.AsyncClient, url: str) -> str:
    response = await client.get(url, follow_redirects=True)
    response.raise_for_status()
    return response.text


async def fetch_feed_items(client: httpx.AsyncClient, source: Source, max_items: int = 12) -> list[RawItem]:
    xml_text = await fetch_text(client, source.rss_url)
    root = ET.fromstring(xml_text)

    items: list[RawItem] = []

    channel_items = root.findall(".//item")
    atom_entries = root.findall("{http://www.w3.org/2005/Atom}entry")

    if channel_items:
        for item in channel_items[:max_items]:
            title = (item.findtext("title") or "").strip()
            link = (item.findtext("link") or "").strip()
            pub_date = item.findtext("pubDate") or item.findtext("published") or item.findtext("updated")
            description = item.findtext("description") or item.findtext("summary") or ""
            items.append(
                RawItem(
                    source_key=source.key,
                    source_name=source.name,
                    title=clean_html(title),
                    url=normalize_url(source.homepage, link),
                    published_at=to_iso(parse_datetime(pub_date)),
                    summary=clean_html(description)[:1200],
                )
            )
        return items

    ns = {"atom": "http://www.w3.org/2005/Atom"}
    for entry in atom_entries[:max_items]:
        title = (entry.findtext("atom:title", default="", namespaces=ns) or "").strip()
        published = entry.findtext("atom:published", default="", namespaces=ns) or entry.findtext("atom:updated", default="", namespaces=ns)
        summary = entry.findtext("atom:summary", default="", namespaces=ns)
        link_el = entry.find("atom:link", ns)
        href = link_el.attrib.get("href", "") if link_el is not None else ""
        items.append(
            RawItem(
                source_key=source.key,
                source_name=source.name,
                title=clean_html(title),
                url=normalize_url(source.homepage, href),
                published_at=to_iso(parse_datetime(published)),
                summary=clean_html(summary)[:1200],
            )
        )
    return items


class OpenAICompatibleClient:
    def __init__(self) -> None:
        self.api_key = os.getenv("OPENAI_API_KEY", "").strip()
        self.base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
        self.model = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")

    @property
    def enabled(self) -> bool:
        return bool(self.api_key)

    async def chat_json(self, messages: list[dict[str, str]]) -> dict[str, Any]:
        if not self.enabled:
            raise RuntimeError("OPENAI_API_KEY is missing")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model,
            "temperature": 0.2,
            "response_format": {"type": "json_object"},
            "messages": messages,
        }

        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT, headers=headers) as client:
            response = await client.post(f"{self.base_url}/chat/completions", json=payload)
            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            return json.loads(content)

    async def chat_text(self, messages: list[dict[str, str]], temperature: float = 0.7) -> str:
        if not self.enabled:
            raise RuntimeError("OPENAI_API_KEY is missing")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model,
            "temperature": temperature,
            "messages": messages,
        }

        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT, headers=headers) as client:
            response = await client.post(f"{self.base_url}/chat/completions", json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]


def heuristic_rank_items(items: list[RawItem], top_n: int) -> list[RankedItem]:
    keywords = {
        "model": 20,
        "agent": 18,
        "openai": 18,
        "google": 15,
        "deepmind": 15,
        "anthropic": 15,
        "microsoft": 15,
        "nvidia": 14,
        "policy": 12,
        "regulation": 12,
        "enterprise": 10,
        "safety": 12,
        "release": 10,
        "paper": 8,
        "benchmark": 8,
        "chip": 8,
        "inference": 10,
        "robot": 8,
        "reasoning": 14,
    }

    ranked: list[RankedItem] = []
    now = datetime.now(timezone.utc)

    for item in items:
        haystack = f"{item.title} {item.summary}".lower()
        score = sum(weight for term, weight in keywords.items() if term in haystack)
        published = parse_datetime(item.published_at)
        if published:
            age_hours = max((now - published).total_seconds() / 3600, 0)
            recency_bonus = max(0, 24 - int(age_hours // 12))
            score += recency_bonus

        ranked.append(
            RankedItem(
                source_key=item.source_key,
                source_name=item.source_name,
                title=item.title,
                url=item.url,
                published_at=item.published_at,
                source_summary=item.summary,
                relevance_score=min(100, score),
                importance_score=min(100, score),
                human_impact_score=min(100, max(20, score - 5)),
                business_impact_score=min(100, max(15, score - 10)),
                why_it_matters="This item appears important due to recency, AI relevance, and likely public or business impact.",
                audience_summary=(item.summary or item.title)[:280],
                category="general_ai_news",
            )
        )

    ranked.sort(key=lambda x: (x.importance_score, x.relevance_score, x.published_at or ""), reverse=True)
    return ranked[:top_n]


async def llm_rank_items(ai: OpenAICompatibleClient, source: Source, items: list[RawItem], top_n: int) -> list[RankedItem]:
    compact_items = [asdict(item) for item in items]
    prompt = {
        "source": source.name,
        "instruction": (
            "Select the 3 most relevant AI news items from this source. "
            "Rank by actual importance, human impact, business impact, and explanatory value for a broad audience. "
            "Return strict JSON with key 'items'."
        ),
        "schema": {
            "items": [
                {
                    "title": "string",
                    "url": "string",
                    "relevance_score": 0,
                    "importance_score": 0,
                    "human_impact_score": 0,
                    "business_impact_score": 0,
                    "why_it_matters": "string",
                    "audience_summary": "string",
                    "category": "string"
                }
            ]
        },
        "candidates": compact_items,
    }

    data = await ai.chat_json(
        [
            {
                "role": "system",
                "content": (
                    "You are an experienced AI editor. "
                    "Be sharp, factual, and concise. Use only the provided candidate items."
                ),
            },
            {"role": "user", "content": json.dumps(prompt, ensure_ascii=False)},
        ]
    )

    selected = data.get("items", [])[:top_n]
    by_url = {item.url: item for item in items}
    result: list[RankedItem] = []

    for entry in selected:
        raw = by_url.get(entry.get("url", ""))
        if raw is None:
            continue
        result.append(
            RankedItem(
                source_key=raw.source_key,
                source_name=raw.source_name,
                title=raw.title,
                url=raw.url,
                published_at=raw.published_at,
                source_summary=raw.summary,
                relevance_score=int(entry.get("relevance_score", 70)),
                importance_score=int(entry.get("importance_score", 70)),
                human_impact_score=int(entry.get("human_impact_score", 70)),
                business_impact_score=int(entry.get("business_impact_score", 70)),
                why_it_matters=str(entry.get("why_it_matters", "")),
                audience_summary=str(entry.get("audience_summary", raw.summary[:280])),
                category=str(entry.get("category", "general_ai_news")),
            )
        )

    if len(result) < top_n:
        fallback = heuristic_rank_items(items, top_n)
        existing_urls = {item.url for item in result}
        for item in fallback:
            if item.url not in existing_urls:
                result.append(item)
            if len(result) == top_n:
                break

    return result[:top_n]


async def select_top_items_per_source(ai: OpenAICompatibleClient, source: Source, items: list[RawItem]) -> list[RankedItem]:
    if ai.enabled:
        try:
            return await llm_rank_items(ai, source, items, MAX_ITEMS_PER_SOURCE)
        except Exception:
            pass
    return heuristic_rank_items(items, MAX_ITEMS_PER_SOURCE)


def globally_rank(items: list[RankedItem]) -> list[RankedItem]:
    def published_key(item: RankedItem) -> float:
        dt = parse_datetime(item.published_at)
        return dt.timestamp() if dt else 0.0

    return sorted(
        items,
        key=lambda x: (
            x.importance_score,
            x.human_impact_score,
            x.business_impact_score,
            x.relevance_score,
            published_key(x),
        ),
        reverse=True,
    )


async def generate_column(ai: OpenAICompatibleClient, ranked_items: list[RankedItem]) -> str:
    top_pack = [
        {
            "rank": i + 1,
            "source": item.source_name,
            "title": item.title,
            "url": item.url,
            "summary": item.audience_summary,
            "why_it_matters": item.why_it_matters,
            "category": item.category,
        }
        for i, item in enumerate(ranked_items)
    ]

    if not ai.enabled:
        intro = (
            "This week in AI felt a bit like watching someone install a rocket engine on a shopping cart. "
            "A lot of power, a lot of excitement, and at least one person in the room quietly asking whether anyone checked the brakes."
        )
        body_points = "\n\n".join(
            f"{i+1}. {item['title']} ({item['source']}): {item['summary']} Why it matters: {item['why_it_matters']}"
            for i, item in enumerate(top_pack[:12])
        )
        return f"{intro}\n\n{body_points}\n\nThe short version: AI is becoming more useful, more normal, and more invisible at the same time. That is exactly why ordinary people need plain-language explanations, not magic tricks."

    prompt = {
        "task": "Write a premium-quality column draft based on the ranked AI news set.",
        "audience": "People who are not AI users yet and may feel intimidated or bored by AI news.",
        "style": [
            "witty but not silly",
            "warm and intelligent",
            "easy to read",
            "explains ideas in human terms",
            "avoids jargon unless explained",
            "sounds like a strong columnist, not a hype machine",
        ],
        "requirements": [
            "Use the most important stories first.",
            "Connect separate stories into one bigger narrative.",
            "Explain why normal people should care.",
            "Include a memorable opening.",
            "Include light humor and clean transitions.",
            "Do not fabricate facts beyond the provided material.",
            "Length target: 1200 to 1800 words.",
        ],
        "stories": top_pack,
    }

    return await ai.chat_text(
        [
            {
                "role": "system",
                "content": (
                    "You are a world-class technology columnist. "
                    "You turn complicated AI news into lucid, witty, human writing."
                ),
            },
            {"role": "user", "content": json.dumps(prompt, ensure_ascii=False)},
        ],
        temperature=0.8,
    )


def save_json(path: str, data: Any) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def save_text(path: str, data: str) -> None:
    with open(path, "w", encoding="utf-8") as f:
        f.write(data)


def render_markdown_digest(items: list[RankedItem]) -> str:
    lines = [
        "# AI News Digest",
        "",
        f"Generated: {datetime.now(timezone.utc).isoformat()}",
        "",
    ]
    for i, item in enumerate(items, start=1):
        lines.extend(
            [
                f"## {i}. {item.title}",
                f"- Source: {item.source_name}",
                f"- Published: {item.published_at or 'unknown'}",
                f"- Category: {item.category}",
                f"- Relevance: {item.relevance_score}",
                f"- Importance: {item.importance_score}",
                f"- Human impact: {item.human_impact_score}",
                f"- Business impact: {item.business_impact_score}",
                f"- URL: {item.url}",
                f"- Summary: {item.audience_summary}",
                f"- Why it matters: {item.why_it_matters}",
                "",
            ]
        )
    return "\n".join(lines)


async def main() -> None:
    ensure_output_dir()
    ai = OpenAICompatibleClient()

    headers = {"User-Agent": USER_AGENT}
    limits = httpx.Limits(max_keepalive_connections=10, max_connections=20)

    async with httpx.AsyncClient(headers=headers, timeout=REQUEST_TIMEOUT, limits=limits) as client:
        raw_by_source: dict[str, list[RawItem]] = {}
        for source in SOURCES:
            try:
                items = await fetch_feed_items(client, source)
                raw_by_source[source.key] = items
            except Exception as exc:
                print(f"[warn] failed to fetch {source.name}: {exc}")
                raw_by_source[source.key] = []

    selected: list[RankedItem] = []
    for source in SOURCES:
        items = raw_by_source[source.key]
        if not items:
            continue
        top_items = await select_top_items_per_source(ai, source, items)
        selected.extend(top_items)

    ranked = globally_rank(selected)
    column = await generate_column(ai, ranked)

    save_json(os.path.join(OUTPUT_DIR, "raw_items.json"), {
        key: [asdict(item) for item in value]
        for key, value in raw_by_source.items()
    })
    save_json(os.path.join(OUTPUT_DIR, "ranked_items.json"), [asdict(item) for item in ranked])
    save_text(os.path.join(OUTPUT_DIR, "digest.md"), render_markdown_digest(ranked))
    save_text(os.path.join(OUTPUT_DIR, "column.md"), column)

    print("Done.")
    print(f"Sources fetched: {len([k for k, v in raw_by_source.items() if v])}/{len(SOURCES)}")
    print(f"Ranked items: {len(ranked)}")
    print(f"Output directory: {os.path.abspath(OUTPUT_DIR)}")


if __name__ == "__main__":
    try:
        loop = asyncio.get_running_loop()
        # If a loop is already running (e.g. Jupyter, VSCode interactive), schedule the task
        loop.create_task(main())
    except RuntimeError:
        # Normal Python execution
        asyncio.run(main())