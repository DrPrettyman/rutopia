import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ComicReader, ReaderView } from "@/components/ComicReader";
import { sanityFetch } from "@/sanity/lib/client";
import { comicPathsQuery, comicQuery } from "@/sanity/lib/queries";
import type { Comic } from "@/sanity/lib/types";

type Params = { library: string; series: string; comic: string };
type Props = { params: Promise<Params> };

export async function generateStaticParams() {
  return (await sanityFetch<Params[]>(comicPathsQuery)) ?? [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await sanityFetch<Comic>(comicQuery, await params);
  return c ? { title: `${c.title} – ${c.series.title}`, description: c.description } : {};
}

export default async function ComicPage({ params }: Props) {
  const comic = await sanityFetch<Comic>(comicQuery, await params);
  if (!comic || !comic.pages?.length) notFound();

  return (
    <main>
      <Suspense fallback={<ReaderView comic={comic} initialIndex={0} />}>
        <ComicReader comic={comic} />
      </Suspense>
      {/* Transcripts: invisible to sighted readers but indexed by search engines and read by screen readers. */}
      {comic.pages.some((p) => p._type === "comicImage" && p.transcript) && (
        <section className="sr-only">
          <h2>Transcript</h2>
          {comic.pages.map((p, i) =>
            p._type === "comicImage" && p.transcript ? (
              <p key={p._key}>
                Page {i + 1}: {p.transcript}
              </p>
            ) : null,
          )}
        </section>
      )}
    </main>
  );
}
