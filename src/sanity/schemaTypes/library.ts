import { defineField, defineType } from "sanity";

export const library = defineType({
  name: "library",
  title: "Library",
  type: "document",
  description: "A top-level shelf on the homepage, e.g. “Superhero comics”.",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      description: "The web address for this library. Click Generate.",
      options: { source: "title", maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", type: "text", rows: 2 }),
    defineField({
      name: "icon",
      type: "image",
      description: "Optional picture shown on the homepage button.",
      options: { hotspot: true },
    }),
    defineField({
      name: "colour",
      type: "string",
      description: "Colour of the homepage button.",
      initialValue: "red",
      options: {
        layout: "radio",
        direction: "horizontal",
        list: ["red", "blue", "yellow", "green", "purple", "orange"].map((c) => ({
          title: c[0].toUpperCase() + c.slice(1),
          value: c,
        })),
      },
    }),
    defineField({
      name: "order",
      type: "number",
      description: "Lower numbers appear first. Leave blank to sort alphabetically.",
    }),
  ],
  preview: { select: { title: "title", subtitle: "description", media: "icon" } },
});
