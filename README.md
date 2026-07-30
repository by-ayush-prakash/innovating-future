# innovatingfuture.com

Static site for the Center for Innovating the Future. Astro, no client framework,
deployed on Netlify.

## Run it

```
cd site
npm install
npm run dev
```

Then http://localhost:4321

## Build

```
cd site
npm run build
```

Output goes to `site/dist`. Netlify runs this automatically on push to `main`
using the `base = "site"` setting in `netlify.toml`.

## How it is put together

- `site/src/config.ts` is the single source of truth for org facts, the three
  properties, the principles, and any sentence that appears on more than one
  page. Change a name or a claim there, not in a page.
- `site/src/lib/feed.ts` fetches the podcast RSS once per build. `/podcast` and
  any episode count read from it, so the numbers can never disagree.
- `site/src/styles/global.css` is the design system. Read it rather than
  inventing values.
- `site/public/brand.html` is the brand export sheet: LinkedIn covers, logo
  lockups, and the monogram, all at final pixel size.

## Design rules

1. One saturated accent (`#DE3A11`) against paper. Nothing else.
2. Hairline-bordered cards, square corners, no shadow.
3. One full-bleed accent band per page, at the close. Never twice.
4. Serif (Newsreader) only where CIF is thinking out loud: the Credo, essays.
   Never in interface.
5. Schematic line diagrams, hand-authored SVG. Never 3D, never stock.
6. `text-wrap: balance` on headings, `pretty` on body copy.

## Copy rules

No em dashes. Precise numbers. Start with the fact. Third person, full
sentences, outside the Credo, which stays verbatim.

Banned: delve, tapestry, testament, underscore, moreover, furthermore, crucial,
pivotal, realm, landscape, navigate, foster, leverage, robust, seamless,
multifaceted, nuanced, intricate, vibrant, boasts, "stands as".

## Feed refresh

`.github/workflows/refresh-feed.yml` rebuilds the site weekly so newly published
episodes appear. Needs a `NETLIFY_BUILD_HOOK` repository secret.
