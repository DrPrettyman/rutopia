# CLAUDE.md

Rutopia: comic library site. Next.js 16 App Router, React 19, Tailwind 4, Sanity v6 (embedded Studio at `/studio`), Vercel.

## Commands
npm run dev | npm run build | npm run lint | npm run typecheck

## Layout
- `src/app/(site)/` public site (own root layout); `src/app/studio/` Studio (own root layout)
- Routes: `/` → `/[library]` → `/[library]/[series]` → `/[library]/[series]/[comic]?p=N`
- `src/sanity/schemaTypes/` library, series, comic (pages[] = comicImage | comicVideo)
- `src/sanity/lib/queries.ts` all GROQ; `types.ts` hand-written result types (keep in sync)
- `src/sanity/lib/client.ts` `sanityFetch()` returns null when Sanity isn't configured; all fetches tagged `sanity`
- `src/app/api/revalidate/route.ts` Sanity webhook → `revalidateTag("sanity", { expire: 0 })`

## Patterns
- Next 16: `params` is a Promise; `revalidateTag` takes a second arg.
- Images via Sanity CDN: `urlFor()` + custom next/image loader (`src/sanity/imageLoader.ts`); reader uses `<img srcset>` via `srcSetFor()`.
- `panel` / `panel-hover` Tailwind utilities (globals.css) give the comic-panel border + offset shadow.
