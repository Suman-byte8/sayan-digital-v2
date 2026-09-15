"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";

// Multi-image picker: uploads each selected file to Drive immediately,
// shows a thumbnail grid of everything uploaded so far (images[0] is the
// cover/thumbnail used everywhere a single image is needed), with a manual
// "paste a URL" fallback for images already hosted elsewhere.
export function ImageUploader({ images, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [manualUrl, setManualUrl] = useState("");

  async function handleFilesSelected(event) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    try {
      const results = await Promise.all(files.map((file) => api.uploadImage(file)));
      onChange([...images, ...results.map((result) => result.data.url)]);
    } catch (uploadError) {
      setError(
        uploadError instanceof ApiRequestError ? uploadError.message : "Image upload failed.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function handleAddManualUrl() {
    const trimmed = manualUrl.trim();
    if (!trimmed) return;
    onChange([...images, trimmed]);
    setManualUrl("");
  }

  function handleRemove(index) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div key={index} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary uploaded/external URL, not a static local asset */}
              <img
                src={url}
                alt={`Product photo ${index + 1}`}
                className="size-20 rounded-md border border-border object-cover"
              />
              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-foreground/80 px-1.5 py-0.5 text-[10px] font-medium text-background">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                aria-label={`Remove photo ${index + 1}`}
                className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFilesSelected}
        disabled={uploading}
        className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-border"
      />
      {uploading && <p className="text-xs text-muted-foreground">Uploading…</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex gap-2">
        <input
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="or paste an image URL directly"
          className="input"
        />
        <button
          type="button"
          onClick={handleAddManualUrl}
          className="shrink-0 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          Add
        </button>
      </div>
    </div>
  );
}
