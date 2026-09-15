"use client";

import { useState } from "react";

export function ProductImageGallery({ images, name }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square w-full max-w-sm items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
        No photos yet
      </div>
    );
  }

  return (
    <div className="max-w-sm">
      {/* eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary uploaded/external URL, not a static local asset */}
      <img
        src={images[activeIndex]}
        alt={name}
        className="aspect-square w-full rounded-lg border border-border object-cover"
      />
      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`overflow-hidden rounded-md border-2 transition-colors ${
                index === activeIndex ? "border-brand" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary uploaded/external URL, not a static local asset */}
              <img src={url} alt={`${name} photo ${index + 1}`} className="size-16 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
