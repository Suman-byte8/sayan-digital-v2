"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function GoBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      data-cursor="hover"
      className="flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
    >
      <ArrowLeft size={14} />
      Go back
    </button>
  );
}
