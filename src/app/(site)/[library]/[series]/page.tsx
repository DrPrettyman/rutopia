import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmptyState } from "@/components/EmptyState";
import { PageHeading } from "@/components/PageHeading";
import { SanityFillImage } from "@/components/SanityImg";
import { sanityFetch } from "@/sanity/lib/client";
import { seriesPathsQuery, seriesQuery } from "@/sanity/lib/queries";
import type { SeriesWithComics } from "@/sanity/lib/types";

type Props = { params: Promise<{ library: string; series: string }> };

export async function generateStaticParams() {
  return (await sanityFetch<{ library: string; series: string }[]>(seriesPathsQuery)) ?? [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await sanityFetch<SeriesWithComics>(seriesQuery, await params);
  return s ? { title: s.title, description: s.description } : {};
}

export default async function SeriesPage({ params }: Props) {
  const s = await sanityFetch<SeriesWithComics>(seriesQuery, await params);
  if (!s) notFound();

  const base = `/${s.library.slug}/${s.slug}`;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="pt-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: s.library.title, href: `/${s.library.slug}` },
            { label: s.title },
          ]}
        />
      </div>
      <PageHeading title={s.title} description={s.description} />

      {s.comics.length === 0 ? (
        <EmptyState>No comics in this series yet.</EmptyState>
      ) : (
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {s.comics.map((c, i) => (
            <li key={c._id}>
              <Link href={`${base}/${c.slug}`} className="group block">
                <span className="panel panel-hover relative block aspect-[3/4] overflow-hidden bg-white">
                  {c.cover && (
                    <SanityFillImage
                      image={c.cover}
                      alt=""
                      aspect={3 / 4}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      priority={i < 4}
                    />
                  )}
                  {c.issueNumber != null && (
                    <span className="panel absolute top-2 left-2 bg-yellow-300 px-2 py-0.5 font-display text-lg" style={{ boxShadow: "2px 2px 0 var(--color-ink)", borderWidth: 2 }}>
                      #{c.issueNumber}
                    </span>
                  )}
                </span>
                <span className="mt-3 block font-display text-2xl leading-tight tracking-wide group-hover:text-red-600">
                  {c.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
