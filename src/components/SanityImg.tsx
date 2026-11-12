import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage } from "@/sanity/lib/types";

/** Fills its (relatively positioned) parent; cropping honours the hotspot set in the Studio. */
export function SanityFillImage({
  image,
  alt,
  sizes,
  aspect,
  priority,
}: {
  image: SanityImage;
  alt: string;
  sizes: string;
  /** width/height ratio of the box, so Sanity crops around the hotspot. */
  aspect: number;
  priority?: boolean;
}) {
  const src = urlFor(image).width(1000).height(Math.round(1000 / aspect)).fit("crop").url();
  const lqip = image.asset.metadata?.lqip;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
      placeholder={lqip ? "blur" : "empty"}
      blurDataURL={lqip}
    />
  );
}
