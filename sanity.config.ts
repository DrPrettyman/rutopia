"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "rutopia",
  title: "Rutopia",
  basePath: "/studio",
  projectId: projectId || "unset",
  dataset,
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: "comic-in-series",
        title: "Comic in series",
        schemaType: "comic",
        parameters: [{ name: "seriesId", type: "string" }],
        value: ({ seriesId }: { seriesId: string }) => ({ series: { _type: "reference", _ref: seriesId } }),
      },
    ],
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
