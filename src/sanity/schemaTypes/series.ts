import { defineField, defineType } from "sanity";

export const series = defineType({
  name: "series",
  title: "Series",
  type: "document",
  description: "A run of comics about the same character or story, e.g. “Jellyman”.",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "library",
      type: "reference",
      to: [{ type: "library" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "icon",
      type: "image",
      description: "Square-ish picture shown as this series' button. Drag the hotspot onto the character's face.",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "order",
      type: "number",
      description: "Lower numbers appear first. Leave blank to sort alphabetically.",
    }),
  ],
  preview: {
    select: { title: "title", library: "library.title", media: "icon" },
    prepare: ({ title, library, media }) => ({ title, subtitle: library, media }),
  },
});
