export const handler = async function(event, context) {
  try {
    const RSS_URL = 'https://anchor.fm/s/4f9f9cb0/podcast/rss';
    const r = await fetch(RSS_URL);
    if (!r.ok) {
      throw new Error(`Failed to fetch RSS: ${r.status} ${r.statusText}`);
    }
    const xml = await r.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => {
      const block = m[1];
      const get = (tag) => {
        const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
        if (!match) return '';
        let val = match[1];
        val = val.replace(/^\s*<!\[CDATA\[/, '').replace(/\]\]>\s*$/, '');
        val = val
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;#39;/g, "'")
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&');
        val = val.replace(/<[^>]*>/g, '');
        return val.trim();
      };
      return {
        title: get('title'),
        description: get('itunes:summary') || get('description'),
        pubDate: get('pubDate'),
        episode: get('itunes:episode'),
        audio: (block.match(/<enclosure url="(.*?)"/) || [])[1] || '',
        image: (block.match(/<itunes:image href="(.*?)"/) || [])[1] || '',
      };
    });

    return {
      statusCode: 200,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ episodes: items }),
    };
  } catch (error) {
    console.error("Failed to fetch RSS:", error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: "Failed to fetch episodes" }),
    };
  }
};