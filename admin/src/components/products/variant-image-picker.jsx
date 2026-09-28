"use client";

import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";

// Multi-image picker for one variant row in the matrix table — same
// upload-or-paste-a-URL pattern as ImageUploader, just compact for a table
// cell instead of the full product form's Photos field.
export function VariantImagePicker({ images, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");

  async function handleFilesSelected(event) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    try {
      const results = await Promise.all(files.map((file) => api.uploadImage(file)));
      onChange([...images, ...results.map((result) => result.data.url)]);
    } catch (uploadError) {
      setError(uploadError instanceof ApiRequestError ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function handleAddUrl() {
    const trimmed = urlDraft.trim();
    if (!trimmed) return;
    onChange([...images, trimmed]);
    setUrlDraft("");
    setShowUrlInput(false);
  }

  function handleRemove(index) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        {images.map((url, index) => (
          <div key={index} className="group relative">
            {/* eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary uploaded/external URL */}
            <img src={url} alt="Variant" className="size-10 rounded-md border border-border object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              aria-label="Remove image"
              className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={10} />
            </button>
          </div>
        ))}

        <label
          className="flex size-10 cursor-pointer items-center justify-center rounded-md border border-dashed border-border text-muted-foreground hover:bg-muted"
          title="Upload an image"
        >
          {uploading ? <span className="text-[9px]">…</span> : <ImagePlus size={14} />}
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFilesSelected}
            disabled={uploading}
            className="hidden"
          />
        </label>

        <button
          type="button"
          onClick={() => setShowUrlInput((v) => !v)}
          className="text-[10px] font-medium text-brand hover:underline"
        >
          or URL
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-1">
          <input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddUrl();
              }
            }}
            placeholder="Paste image URL"
            className="w-32 rounded-md border border-border bg-background px-1.5 py-1 text-[11px] text-foreground focus:border-brand focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="rounded-md border border-border px-2 py-1 text-[10px] font-medium text-foreground hover:bg-muted"
          >
            Add
          </button>
        </div>
      )}

      {error && <p className="text-[10px] text-destructive">{error}</p>}
    </div>
  );
}
