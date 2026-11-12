import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sanity's CDN does the resizing and format conversion, so Next/Vercel
    // don't re-optimise. See src/sanity/imageLoader.ts.
    loader: "custom",
    loaderFile: "./src/sanity/imageLoader.ts",
  },
};

export default nextConfig;
