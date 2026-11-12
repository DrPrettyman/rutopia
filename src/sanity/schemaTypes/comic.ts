import { defineArrayMember, defineField, defineType } from "sanity";

export const comic = defineType({
  name: "comic",
  title: "Comic",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "series",
      type: "reference",
      to: [{ type: "series" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "issueNumber",
      type: "number",
      description: "Optional. Comics in a series are listed by issue number, then by date.",
    }),
    defineField({ name: "publishedAt", title: "Date", type: "date" }),
    defineField({
      name: "cover",
      type: "image",
      description: "Optional. If left empty, the first page is used as the cover.",
      options: { hotspot: true },
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "pages",
      type: "array",
      description:
        "One item per page, in reading order. You can drop several scans in at once, and drag to reorder.",
      of: [
        defineArrayMember({
          name: "comicImage",
          title: "Page (scan)",
          type: "object",
          fields: [
            defineField({ name: "image", type: "image", validation: (r) => r.required() }),
            defineField({
              name: "alt",
              title: "Short description",
              type: "string",
              description: "One line describing the page, for screen readers.",
            }),
            defineField({
              name: "transcript",
              type: "text",
              rows: 4,
              description: "Optional: the speech bubbles and captions as text. Helps search engines and accessibility.",
            }),
          ],
          preview: {
            select: { media: "image", alt: "alt" },
            prepare: ({ media, alt }) => ({ title: alt || "Page", media }),
          },
        }),
        defineArrayMember({
          name: "comicVideo",
          title: "Video",
          type: "object",
          fields: [
            defineField({
              name: "video",
              type: "file",
              options: { accept: "video/mp4,video/webm,video/quicktime" },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "poster",
              type: "image",
              description: "Optional still shown before the video plays.",
            }),
            defineField({ name: "caption", type: "string" }),
          ],
          preview: {
            select: { caption: "caption", media: "poster" },
            prepare: ({ caption, media }) => ({ title: caption || "Video", subtitle: "Video", media }),
          },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  orderings: [
    { title: "Issue number", name: "issue", by: [{ field: "issueNumber", direction: "asc" }] },
    { title: "Newest first", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", series: "series.title", issue: "issueNumber", cover: "cover", firstPage: "pages.0.image" },
    prepare: ({ title, series, issue, cover, firstPage }) => ({
      title: issue != null ? `#${issue} ${title}` : title,
      subtitle: series,
      media: cover ?? firstPage,
    }),
  },
});
