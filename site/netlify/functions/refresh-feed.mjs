// Rebuilds the site once a day so /podcast and the homepage pick up new episodes.
// The RSS is fetched at build time, so without this the feed goes stale.
//
// Setup, once, in the Netlify UI:
//   1. Site configuration > Build & deploy > Build hooks > Add build hook.
//      Name it "Daily feed refresh", branch main. Copy the URL.
//   2. Site configuration > Environment variables > Add BUILD_HOOK_URL = that URL.
// No GitHub permissions needed.

export default async () => {
  const hook = process.env.BUILD_HOOK_URL;
  if (!hook) {
    console.error("BUILD_HOOK_URL is not set. Skipping rebuild.");
    return new Response("BUILD_HOOK_URL not set", { status: 500 });
  }
  const res = await fetch(hook, { method: "POST" });
  console.log(`Build hook returned ${res.status}`);
  return new Response(`Build hook returned ${res.status}`, { status: res.ok ? 200 : 502 });
};

export const config = { schedule: "0 9 * * *" };
