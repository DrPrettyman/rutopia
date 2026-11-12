[![Netlify Status](https://api.netlify.com/api/v1/badges/984615e2-b830-4d20-be79-2d885fb19e20/deploy-status)](https://app.netlify.com/projects/rutopia-comics/deploys)

# Rutopia

Comic library site: **Home → Library → Series → Comic reader**. Next.js 16 (App Router) + Sanity (Studio embedded at `/studio`), deployed on Netlify.

## First-time setup

1. `npm install`
2. Create a Sanity project (or reuse one) and add a dataset:
   `npx sanity@latest init --env .env.local` (choose "create new project", dataset `production`),
   or create it at https://www.sanity.io/manage and copy the project ID.
3. `cp .env.example .env.local` and fill in `NEXT_PUBLIC_SANITY_PROJECT_ID`.
4. In sanity.io/manage → API → **CORS origins**, add `http://localhost:3000` and the live URL (tick *Allow credentials*). The embedded Studio won't log in without this.
5. `npm run dev` → site on http://localhost:3000, Studio on http://localhost:3000/studio

## Content model

| Type | What it is | Key fields |
|---|---|---|
| `library` | Homepage button (e.g. "Superhero comics") | title, slug, icon, colour, order |
| `series` | Icon inside a library (e.g. "Jellyman") | title, slug, library →, icon, order |
| `comic` | One readable comic | title, slug, series →, issueNumber, date, cover (optional; falls back to page 1), **pages** |

`pages` is an ordered array of **Page (scan)** (image + alt + optional transcript) and **Video** (file + optional poster + caption) items.

URLs: `/{library}/{series}/{comic}?p=3`

## Deploying (Netlify)

- Env vars: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_REVALIDATE_SECRET`.
- **Webhook** so new comics appear immediately: sanity.io/manage → API → Webhooks →
  URL `https://<site>/api/revalidate`, dataset `production`, trigger on create/update/delete,
  filter `_type in ["library", "series", "comic"]`, secret = `SANITY_REVALIDATE_SECRET`, HTTP method POST.
  Without it, pages still refresh within an hour.

## Notes

- Images are resized by Sanity's CDN (custom `next/image` loader in `src/sanity/imageLoader.ts`); Next/Netlify image optimisation is bypassed.
- The reader (`src/components/ComicReader.tsx`) uses plain `<img srcset>` and preloads the previous/next page. Arrow keys and swipe work.
- Videos are served straight from Sanity's file CDN. Fine for short clips. If they get long or numerous, look at the Sanity Mux plugin for proper streaming.
- Fonts (Bangers, Nunito; SIL OFL) are self-hosted in `src/fonts`.
