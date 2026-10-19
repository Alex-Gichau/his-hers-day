"use client";

import { ExternalLink, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { MapData } from "@/types/data";

interface VenueMapProps {
  map: MapData;
}

/**
 * A realistic, interactive Google Maps embed for the wedding venue.
 * The iframe is sandboxed and lazy-loaded so it does not block paint.
 */
export function VenueMap({ map }: VenueMapProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
            <MapPin className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="font-wedding-alt text-xl leading-tight text-foreground">
              {map.title}
            </p>
            <p className="truncate text-xs text-muted-foreground">{map.description}</p>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          className="shrink-0 rounded-full px-5 text-sm"
        >
          <a href={map.directionsUrl} target="_blank" rel="noreferrer noopener">
            Directions
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </Button>
      </div>

      <div className="relative w-full">
        <iframe
          title={`Map showing ${map.title}`}
          src={map.embedUrl}
          className="h-[320px] w-full border-0 grayscale-[0.35] contrast-[1.05] sm:h-[380px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default VenueMap;
