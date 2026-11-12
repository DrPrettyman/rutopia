import { defineQuery } from "next-sanity";

// Reusable image projection: expands the asset so we have URL + dimensions + blur placeholder.
const image = `{..., asset->{_id, url, metadata{lqip, dimensions}}}`;
const ordering = `order(coalesce(order, 9999) asc, title asc)`;

export const librariesQuery = defineQuery(`
  *[_type == "library" && defined(slug.current)] | ${ordering} {
    _id, title, "slug": slug.current, description, colour, icon${image}
  }
`);

export const libraryQuery = defineQuery(`
  *[_type == "library" && slug.current == $library][0] {
    _id, title, "slug": slug.current, description, colour, icon${image},
    "series": *[_type == "series" && references(^._id) && defined(slug.current)] | ${ordering} {
      _id, title, "slug": slug.current, description, icon${image}
    }
  }
`);

export const seriesQuery = defineQuery(`
  *[_type == "series" && slug.current == $series && library->slug.current == $library][0] {
    _id, title, "slug": slug.current, description, icon${image},
    "library": library->{title, "slug": slug.current},
    "comics": *[_type == "comic" && references(^._id) && defined(slug.current)]
      | order(coalesce(issueNumber, 9999) asc, publishedAt asc, title asc) {
        _id, title, "slug": slug.current, issueNumber, publishedAt,
        "cover": coalesce(cover, pages[_type == "comicImage"][0].image)${image}
      }
  }
`);

export const comicQuery = defineQuery(`
  *[_type == "comic" && slug.current == $comic
    && series->slug.current == $series
    && series->library->slug.current == $library][0] {
    _id, title, "slug": slug.current, issueNumber, description,
    "series": series->{title, "slug": slug.current},
    "library": series->library->{title, "slug": slug.current},
    "pages": pages[] {
      _key, _type,
      _type == "comicImage" => { "image": image${image}, alt, transcript },
      _type == "comicVideo" => {
        "url": video.asset->url, "mimeType": video.asset->mimeType,
        "poster": poster${image}, caption
      }
    }
  }
`);

// For generateStaticParams
export const libraryPathsQuery = defineQuery(`*[_type == "library" && defined(slug.current)]{ "library": slug.current }`);
export const seriesPathsQuery = defineQuery(`
  *[_type == "series" && defined(slug.current) && defined(library->slug.current)]{
    "library": library->slug.current, "series": slug.current
  }
`);
export const comicPathsQuery = defineQuery(`
  *[_type == "comic" && defined(slug.current) && defined(series->slug.current)]{
    "library": series->library->slug.current, "series": series->slug.current, "comic": slug.current
  }
`);
