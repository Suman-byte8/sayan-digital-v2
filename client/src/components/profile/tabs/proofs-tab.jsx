"use client";

import { useState } from "react";
import {
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Download,
  MessageSquare,
  Sparkles,
  Info,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProofsTab({ proofs, onApprove }) {
  const [selectedProof, setSelectedProof] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  async function handleApprove(proofId) {
    setApprovingId(proofId);
    try {
      await onApprove(proofId);
      alert("Proof Approved! Sayan Digital's print unit will now proceed to physical production.");
    } catch {
      alert("Couldn't approve this proof — please try again.");
    } finally {
      setApprovingId(null);
    }
  }

  // No backend workflow exists yet for revision comments (see
  // server/README.md's proofs caveat - there's no admin side to receive
  // this either, since proofs themselves aren't created by anything yet)
  // - kept as a local-only stub so the UI doesn't dead-end, not wired to
  // a real endpoint.
  function handleRequestRevision(proofId) {
    if (!commentText.trim()) {
      alert("Please enter the specific design changes or corrections needed.");
      return;
    }
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setSelectedProof(null);
      setCommentText("");
      alert("Revision request sent to the designer team.");
    }, 1200);
  }

  return (
    <div className="space-y-6">
      {/* Informative Header Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-(--brand)/20 bg-(--brand)/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--brand) text-white shadow-sm">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-serif text-lg font-normal text-foreground">
              Studio Artwork & Proof Approvals
            </h3>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
              Before printing mugs, acrylic trophies, or apparel, our studio sends a digital mockup
              for your confirmation to ensure 100% spelling, alignment, and color accuracy.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-xl bg-card px-3.5 py-2 text-xs border border-border shadow-sm">
          <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-muted-foreground">Pending Action:</span>
          <span className="font-semibold text-foreground">
            {proofs.filter((p) => p.status === "pending").length} proof(s)
          </span>
        </div>
      </div>

      {/* Proof Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {proofs.map((proof) => {
          const isPending = proof.status === "pending";
          const isApproved = proof.status === "approved";

          return (
            <div
              key={proof.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/50">
                <img
                  src={proof.previewUrl}
                  alt={proof.title}
                  className="size-full object-cover object-center transition-transform duration-300 hover:scale-105"
                />

                {/* Status Chip */}
                <div className="absolute right-3 top-3">
                  {isPending ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur-sm">
                      <AlertCircle size={12} />
                      Action Required
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur-sm">
                      <CheckCircle2 size={12} />
                      Approved
                    </span>
                  )}
                </div>

                {/* Dimensions badge */}
                <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                  {proof.dimensions}
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>Proof ID: {proof.id}</span>
                  <span>Ref Order: #{proof.orderRef}</span>
                </div>

                <h4 className="mt-2 font-serif text-lg font-medium text-foreground">
                  {proof.title}
                </h4>
                <p className="mt-0.5 text-xs text-muted-foreground">{proof.product}</p>

                {/* Designer Notes */}
                <div className="mt-3.5 rounded-xl border border-border/80 bg-(--paper-muted) p-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
                    <Info size={12} className="text-(--brand)" />
                    <span>Designer Note:</span>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                    {proof.notes}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground/80">
                    <span>Assigned: {proof.designer}</span>
                    <span>Palette: {proof.colorProfile}</span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-5 flex flex-wrap items-center gap-2 pt-2">
                  {isPending ? (
                    <>
                      <Button
                        size="sm"
                        disabled={approvingId === proof.id}
                        className="flex-1 gap-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs"
                        onClick={() => handleApprove(proof.id)}
                      >
                        <Check size={14} />
                        {approvingId === proof.id ? "Approving…" : "Approve for Printing"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full text-xs"
                        onClick={() => setSelectedProof(proof)}
                      >
                        <MessageSquare size={13} />
                        Request Changes
                      </Button>
                    </>
                  ) : (
                    <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <CheckCircle2 size={14} />
                        {proof.approvedDate}
                      </span>
                      <button
                        type="button"
                        onClick={() => alert(`Downloading high-resolution proof file for ${proof.id}...`)}
                        className="inline-flex items-center gap-1 text-foreground hover:text-(--brand) font-medium underline-offset-2 hover:underline"
                      >
                        <Download size={13} />
                        Download Hi-Res PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Requesting Revision */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h3 className="font-serif text-xl font-medium text-foreground">
              Request Design Changes
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              For: <span className="font-semibold text-foreground">{selectedProof.title}</span> (
              {selectedProof.id})
            </p>

            <div className="mt-4">
              <label className="text-xs font-medium text-foreground">
                Describe the modifications you need:
              </label>
              <textarea
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="e.g. Please change the font to serif, make student names 10% larger, or shift the school crest to the top center..."
                className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-(--brand) focus:outline-none focus:ring-1 focus:ring-(--brand)"
              />
            </div>

            {feedbackSuccess && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 font-medium">
                <CheckCircle2 size={14} />
                Feedback recorded! Sending to designer...
              </div>
            )}

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setSelectedProof(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="rounded-full text-xs"
                onClick={() => handleRequestRevision(selectedProof.id)}
              >
                Submit Revisions
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
