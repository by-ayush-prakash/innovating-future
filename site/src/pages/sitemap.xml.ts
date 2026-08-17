import type { APIRoute } from "astro";

// Derived from the pages directory, so it cannot drift when a route is added
// or renamed. Add nothing here by hand.
const files = Object.keys(import.meta.glob("./**/*.astro"));

const routes = files
  .map((f) => f.replace(/^\.\//, "").replace(/\.astro$/, ""))
  .filter((r) => r !== "404" && r !== "contact/thanks")
  .map((r) => r.replace(/\/index$/, ""))
  .map((r) => (r === "index" ? "" : r))
  .sort();

// Pages a journalist or partner lands on first get a higher priority.
const priority = (r: string) =>
  r === "" ? "1.0"
  : ["work", "work/coexisting-with-ai", "team", "media"].includes(r) ? "0.9"
  : ["terms", "privacy"].includes(r) ? "0.3"
  : "0.7";

export const GET: APIRoute = ({ site }) => {
  const base = site?.toString().replace(/\/$/, "") ?? "";
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => `  <url>\n    <loc>${base}/${r}</loc>\n    <priority>${priority(r)}</priority>\n  </url>`)
  .join("\n")}
</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
};
