// Single source for the podcast feed. Fetched once per build, shared by
// /podcast (episode list) and / (stat band), so the counts can never disagree.

export interface Episode {
  title: string;
  description: string;
  pubDate: string;
  audio: string;
  image: string;
}

const RSS_URL = "https://anchor.fm/s/4f9f9cb0/podcast/rss";

function decode(val: string) {
  return val
    .replace(/^\s*<!\[CDATA\[/, "")
    .replace(/\]\]>\s*$/, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;#39;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/<[^>]*>/g, "")
    .trim();
}

let cache: Promise<{ episodes: Episode[]; fetchFailed: boolean }> | null = null;

async function load() {
  try {
    const res = await fetch(RSS_URL);
    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
    const xml = await res.text();
    const channelImageMatch = xml.match(/<itunes:image href="(.*?)"/);
    const channelImage = channelImageMatch ? channelImageMatch[1] : "";

    const episodes: Episode[] = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => {
      const block = m[1];
      const get = (tag: string) => {
        const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
        return match ? decode(match[1]) : "";
      };
      const imageMatch = block.match(/<itunes:image href="(.*?)"/);
      return {
        title: get("title"),
        description: get("itunes:summary") || get("description"),
        pubDate: get("pubDate"),
        audio: (block.match(/<enclosure url="(.*?)"/) || [])[1] || "",
        image: imageMatch ? imageMatch[1] : channelImage,
      };
    });
    return { episodes, fetchFailed: false };
  } catch (err) {
    console.error("Podcast RSS fetch failed at build time:", err);
    return { episodes: [] as Episode[], fetchFailed: true };
  }
}

export function getFeed() {
  if (!cache) cache = load();
  return cache;
}

/** Verified counts, derived from the feed. Never hardcode these. */
export function feedStats(episodes: Episode[]) {
  const times = episodes
    .map((e) => new Date(e.pubDate).getTime())
    .filter((t) => !isNaN(t));
  return {
    count: episodes.length,
    sinceYear: times.length ? new Date(Math.min(...times)).getFullYear() : null,
  };
}
