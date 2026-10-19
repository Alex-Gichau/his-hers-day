import Image from "next/image";

import type { ImageItem } from "@/types/data";

interface GalleryMarqueeProps {
  images: ImageItem[];
}

/**
 * Edge-to-edge gallery strip.
 *
 * The images are rendered twice inside a single flex track. The track is
 * translated by exactly -50% of its own width, which maps the duplicated
 * group perfectly back onto the original one, so the loop is seamless.
 * The animation runs from -50% -> 0, which makes the photos travel from
 * left to right.
 */
export function GalleryMarquee({ images }: GalleryMarqueeProps) {
  if (images.length === 0) return null;

  const renderGroup = (clone: boolean) => (
    <div
      key={clone ? "clone" : "original"}
      aria-hidden={clone || undefined}
      className="flex shrink-0 items-center"
    >
      {images.map((image, index) => (
        <figure
          key={`${image.alt}-${index}`}
          className="relative mr-4 h-56 w-64 shrink-0 overflow-hidden rounded-2xl border border-border/60 shadow-sm sm:h-72 sm:w-80"
        >
          <Image
            src={image.src}
            alt={clone ? "" : image.alt}
            fill
            sizes="(max-width: 640px) 256px, 320px"
            className="object-cover"
          />
        </figure>
      ))}
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden edge-fade-x">
      <div className="flex w-max animate-gallery-marquee items-center hover:[animation-play-state:paused] motion-reduce:animate-none">
        {renderGroup(false)}
        {renderGroup(true)}
      </div>
    </div>
  );
}

export default GalleryMarquee;
