export type SanityImage = {
  _type?: "image";
  asset: {
    _id: string;
    url: string;
    metadata?: { lqip?: string; dimensions?: { width: number; height: number; aspectRatio: number } };
  };
  crop?: unknown;
  hotspot?: unknown;
  alt?: string;
};

export type LibraryColour = "red" | "blue" | "yellow" | "green" | "purple" | "orange";

export type LibrarySummary = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  colour?: LibraryColour;
  icon?: SanityImage;
};

export type SeriesSummary = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  icon?: SanityImage;
};

export type ComicSummary = {
  _id: string;
  title: string;
  slug: string;
  issueNumber?: number;
  publishedAt?: string;
  cover?: SanityImage;
};

export type LibraryWithSeries = LibrarySummary & { series: SeriesSummary[] };

export type SeriesWithComics = SeriesSummary & {
  library: { title: string; slug: string };
  comics: ComicSummary[];
};

export type ComicPage =
  | { _key: string; _type: "comicImage"; image: SanityImage; alt?: string; transcript?: string }
  | { _key: string; _type: "comicVideo"; url: string; mimeType?: string; poster?: SanityImage; caption?: string };

export type Comic = {
  _id: string;
  title: string;
  slug: string;
  issueNumber?: number;
  description?: string;
  series: { title: string; slug: string };
  library: { title: string; slug: string };
  pages: ComicPage[];
};
