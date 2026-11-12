import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { SanityFillImage } from "@/components/SanityImg";
import { isSanityConfigured } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/client";
import { librariesQuery } from "@/sanity/lib/queries";
import type { LibraryColour, LibrarySummary } from "@/sanity/lib/types";

// Full class names so Tailwind picks them up.
const colourClasses: Record<LibraryColour, string> = {
  red: "bg-red-500 text-white",
  blue: "bg-sky-500 text-white",
  yellow: "bg-yellow-300 text-ink",
  green: "bg-emerald-500 text-white",
  purple: "bg-violet-500 text-white",
  orange: "bg-orange-400 text-ink",
};

export default async function HomePage() {
  const libraries = (await sanityFetch<LibrarySummary[]>(librariesQuery)) ?? [];

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <section className="py-12 text-center sm:py-16">
        <h1 className="font-display text-7xl tracking-wide sm:text-8xl">Rutopia</h1>
        <p className="mt-3 text-lg text-muted">Pick a library to start reading.</p>
      </section>

      {libraries.length === 0 ? (
        <EmptyState>
          {isSanityConfigured ? (
            <>No libraries yet. Add one in the <Link href="/studio" className="underline">Studio</Link>.</>
          ) : (
            <>Sanity isn&apos;t connected yet. Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local.</>
          )}
        </EmptyState>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {libraries.map((lib, i) => (
            <li key={lib._id}>
              <Link
                href={`/${lib.slug}`}
                className={`panel panel-hover flex h-full min-h-40 items-center gap-4 p-5 ${colourClasses[lib.colour ?? "red"]}`}
              >
                {lib.icon && (
                  <span className="panel relative size-24 shrink-0 overflow-hidden bg-white" style={{ boxShadow: "none" }}>
                    <SanityFillImage image={lib.icon} alt="" sizes="96px" aspect={1} priority={i < 3} />
                  </span>
                )}
                <span>
                  <span className="block font-display text-4xl leading-none tracking-wide">{lib.title}</span>
                  {lib.description && <span className="mt-2 block text-sm opacity-90">{lib.description}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
