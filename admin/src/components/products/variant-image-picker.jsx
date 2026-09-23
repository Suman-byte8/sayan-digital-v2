"use client";

import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";

// Compact single-image picker for one variant row in the matrix table —
// same upload/compression pipeline as ImageUploader, just one image
// instead of an array, laid out for a table cell.
export function VariantImagePicker({ image, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileSelected(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const result = await api.uploadImage(file);
      onChange(result.data.url);
    } catch (uploadError) {
      setError(uploadError instanceof ApiRequestError ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  if (image) {
    return (
      <div className="group relative inline-block">
        {/* eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary uploaded/external URL */}
        <img src={image} alt="Variant" className="size-10 rounded-md border border-border object-cover" />
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="Remove variant image"
          className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100"
        >
          <X size={10} />
        </button>
      </div>
    );
  }

  return (
    <label
      className="flex size-10 cursor-pointer items-center justify-center rounded-md border border-dashed border-border text-muted-foreground hover:bg-muted"
      title={error || "Upload an image for this variant"}
    >
      {uploading ? (
        <span className="text-[9px]">…</span>
      ) : (
        <ImagePlus size={14} />
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelected}
        disabled={uploading}
        className="hidden"
      />
    </label>
  );
}
