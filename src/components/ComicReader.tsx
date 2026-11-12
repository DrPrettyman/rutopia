"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { srcSetFor, urlFor } from "@/sanity/lib/image";
import type { Comic, ComicPage } from "@/sanity/lib/types";

// The displayed page is limited by viewport height, so its rendered width is roughly
// min(viewport width, ~0.75 × viewport height) for a portrait scan.
const SIZES = "min(100vw, 75vh)";

/**
 * Deep links: /…/comic?p=3 opens on page 3. useSearchParams needs a <Suspense> boundary on a
 * static page; the page renders <ReaderView initialIndex={0}> as the fallback, so the server
 * HTML still contains page 1.
 */
export function ComicReader({ comic }: { comic: Comic }) {
  const p = Number(useSearchParams().get("p"));
  const initialIndex = Number.isInteger(p) && p > 1 ? Math.min(p, comic.pages.length) - 1 : 0;
  return <ReaderView comic={comic} initialIndex={initialIndex} />;
}

export function ReaderView({ comic, initialIndex }: { comic: Comic; initialIndex: number }) {
  const pages = comic.pages;
  const last = pages.length - 1;
  const seriesHref = `/${comic.library.slug}/${comic.series.slug}`;

  const [index, setIndex] = useState(initialIndex);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback((i: number) => setIndex(Math.max(0, Math.min(last, i))), [last]);

  // Keep ?p= in sync without adding history entries for every page turn.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (index === 0) url.searchParams.delete("p");
    else url.searchParams.set("p", String(index + 1));
    window.history.replaceState(window.history.state, "", url);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      // Let arrow keys seek inside a focused video or type in inputs.
      if (t && ["VIDEO", "INPUT", "TEXTAREA"].includes(t.tagName)) return;
      if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1));
  };

  const page = pages[index];

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      {/* Top bar */}
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-2 sm:px-6">
        <Link href={seriesHref} className="shrink-0 text-sm text-muted hover:text-ink">
          ‹ {comic.series.title}
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-center font-display text-2xl tracking-wide">
          {comic.issueNumber != null && <span className="text-red-600">#{comic.issueNumber} </span>}
          {comic.title}
        </h1>
        <span className="shrink-0 text-sm tabular-nums text-muted" aria-live="polite">
          {index + 1} / {pages.length}
        </span>
      </div>

      {/* Stage */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-14 pb-4 sm:px-20"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <PageView key={page._key} page={page} index={index} priority />

        {/* Preload neighbours with identical srcset/sizes so the browser reuses the same files. */}
        <div hidden aria-hidden>
          {[index - 1, index + 1].map((i) =>
            pages[i] ? <PageView key={pages[i]._key} page={pages[i]} index={i} preloadOnly /> : null,
          )}
        </div>

        <Arrow dir="prev" disabled={index === 0} onClick={() => go(index - 1)} />
        {index < last ? (
          <Arrow dir="next" onClick={() => go(index + 1)} />
        ) : (
          <Link
            href={seriesHref}
            className="panel panel-hover absolute right-2 bottom-6 bg-yellow-300 px-4 py-2 font-display text-xl tracking-wide sm:right-4"
          >
            The end ›
          </Link>
        )}
      </div>
    </div>
  );
}

function PageView({
  page,
  index,
  priority,
  preloadOnly,
}: {
  page: ComicPage;
  index: number;
  priority?: boolean;
  preloadOnly?: boolean;
}) {
  if (page._type === "comicVideo") {
    if (preloadOnly) return null; // don't pull video bytes for pages the reader may never reach
    return (
      <figure className="flex h-full max-w-full flex-col items-center justify-center">
        <video
          className="panel max-h-full max-w-full bg-black"
          style={{ boxShadow: "6px 6px 0 var(--color-ink)" }}
          controls
          playsInline
          preload="metadata"
          poster={page.poster ? urlFor(page.poster).width(1600).fit("max").url() : undefined}
        >
          <source src={page.url} type={page.mimeType} />
        </video>
        {page.caption && <figcaption className="mt-2 text-sm text-muted">{page.caption}</figcaption>}
      </figure>
    );
  }

  const dims = page.image.asset.metadata?.dimensions;
  return (
    // Plain <img>: we want srcset straight from Sanity's CDN and exact control over
    // preloading, which next/image doesn't give us here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={urlFor(page.image).width(1280).fit("max").quality(85).url()}
      srcSet={srcSetFor(page.image)}
      sizes={SIZES}
      width={dims?.width}
      height={dims?.height}
      alt={page.alt || `Page ${index + 1}`}
      loading="eager"
      fetchPriority={priority ? "high" : "low"}
      decoding="async"
      draggable={false}
      className={
        preloadOnly
          ? undefined
          : "panel h-auto max-h-full w-auto max-w-full bg-white object-contain select-none"
      }
      style={preloadOnly ? undefined : { boxShadow: "6px 6px 0 var(--color-ink)" }}
    />
  );
}

function Arrow({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled?: boolean; onClick: () => void }) {
  const isPrev = dir === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? "Previous page" : "Next page"}
      className={`panel panel-hover absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white disabled:pointer-events-none disabled:opacity-25 sm:size-14 sm:text-3xl ${
        isPrev ? "left-2 sm:left-4" : "right-2 sm:right-4"
      }`}
    >
      <svg viewBox="0 0 24 24" aria-hidden className="size-6 sm:size-7" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={isPrev ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}
