"use client";

type LoaderArgs = { src: string; width: number; quality?: number };

/** next/image loader: let Sanity's CDN resize; pass anything else through untouched. */
export default function sanityImageLoader({ src, width, quality }: LoaderArgs) {
  if (!src.startsWith("https://cdn.sanity.io/")) return src;
  const url = new URL(src);
  // If the caller fixed an aspect ratio (w + h), keep it when resizing.
  const w0 = Number(url.searchParams.get("w"));
  const h0 = Number(url.searchParams.get("h"));
  if (w0 > 0 && h0 > 0) url.searchParams.set("h", String(Math.round((width * h0) / w0)));
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 80));
  url.searchParams.set("auto", "format");
  if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max");
  return url.toString();
}
