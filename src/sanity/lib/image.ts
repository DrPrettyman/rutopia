import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "../env";
import type { SanityImage } from "./types";

const builder = createImageUrlBuilder({ projectId: projectId || "unset", dataset });

/** Returns a Sanity CDN URL (respecting crop/hotspot). Width/quality are added by the image loader. */
export function urlFor(image: SanityImage) {
  return builder.image(image).auto("format");
}

/** srcset for plain <img> tags (the comic reader), so preloaded neighbours hit the same URLs. */
export function srcSetFor(image: SanityImage, widths = [640, 960, 1280, 1600, 2000]) {
  return widths.map((w) => `${urlFor(image).width(w).fit("max").quality(85).url()} ${w}w`).join(", ");
}
