import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmptyState } from "@/components/EmptyState";
import { PageHeading } from "@/components/PageHeading";
import { SanityFillImage } from "@/components/SanityImg";
import { sanityFetch } from "@/sanity/lib/client";
import { libraryPathsQuery, libraryQuery } from "@/sanity/lib/queries";
import type { LibraryWithSeries } from "@/sanity/lib/types";

type Props = { params: Promise<{ library: string }> };

export async function generateStaticParams() {
  return (await sanityFetch<{ library: string }[]>(libraryPathsQuery)) ?? [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lib = await sanityFetch<LibraryWithSeries>(libraryQuery, await params);
  return lib ? { title: lib.title, description: lib.description } : {};
}

export default async function LibraryPage({ params }: Props) {
  const lib = await sanityFetch<LibraryWithSeries>(libraryQuery, await params);
  if (!lib) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="pt-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: lib.title }]} />
      </div>
      <PageHeading title={lib.title} description={lib.description} />

      {lib.series.length === 0 ? (
        <EmptyState>No series in this library yet.</EmptyState>
      ) : (
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {lib.series.map((s, i) => (
            <li key={s._id}>
              <Link href={`/${lib.slug}/${s.slug}`} className="group block text-center">
                <span className="panel panel-hover relative block aspect-square overflow-hidden bg-white">
                  {s.icon && (
                    <SanityFillImage
                      image={s.icon}
                      alt=""
                      aspect={1}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      priority={i < 4}
                    />
                  )}
                </span>
                <span className="mt-3 block font-display text-2xl tracking-wide group-hover:text-red-600">
                  {s.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
