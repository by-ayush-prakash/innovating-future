import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/episodes", async (req, res) => {
    try {
      const RSS_URL = 'https://anchor.fm/s/4f9f9cb0/podcast/rss';
      const r = await fetch(RSS_URL);
      if (!r.ok) {
        throw new Error(`Failed to fetch RSS: ${r.status} ${r.statusText}`);
      }
      const xml = await r.text();
      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => {
        const block = m[1];
        const get = (tag: string) => {
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
      
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
      res.status(200).json({ episodes: items });
    } catch (error) {
      console.error("Failed to fetch RSS:", error);
      res.status(500).json({ error: "Failed to fetch episodes" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
