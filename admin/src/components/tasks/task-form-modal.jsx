"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";

const STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

function toDateInputValue(iso) {
  return iso ? new Date(iso).toISOString().slice(0, 10) : "";
}

function emptyForm() {
  return {
    title: "",
    description: "",
    status: "PENDING",
    requiresPayment: false,
    assignees: [],
    dueDate: "",
  };
}

// Shared create/edit modal — `task` present means edit, absent means create.
export function TaskFormModal({ task, onClose, onSaved }) {
  const [values, setValues] = useState(
    task
      ? {
          title: task.title,
          description: task.description ?? "",
          status: task.status,
          requiresPayment: task.requiresPayment,
          assignees: task.assignees,
          dueDate: toDateInputValue(task.dueDate),
        }
      : emptyForm(),
  );
  const [assigneeDraft, setAssigneeDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleAddAssignee() {
    const draft = assigneeDraft.trim();
    if (!draft || values.assignees.includes(draft)) return;
    setValues((prev) => ({ ...prev, assignees: [...prev.assignees, draft] }));
    setAssigneeDraft("");
  }
  function handleRemoveAssignee(name) {
    setValues((prev) => ({ ...prev, assignees: prev.assignees.filter((a) => a !== name) }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!values.title.trim()) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    setError("");
    const payload = {
      title: values.title.trim(),
      description: values.description.trim() || null,
      status: values.status,
      requiresPayment: values.requiresPayment,
      assignees: values.assignees,
      dueDate: values.dueDate || null,
    };

    try {
      const { data } = task ? await api.updateTask(task.id, payload) : await api.createTask(payload);
      onSaved(data);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to save task.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            {task ? "Edit Task" : "Add Task"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {task?.order && (
          <p className="mb-4 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            Linked to order <span className="font-medium text-foreground">{task.order.orderNumber}</span>
            {task.order.customerName ? ` — ${task.order.customerName}` : ""}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Title</label>
            <input
              value={values.title}
              onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))}
              className="input"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Details</label>
            <textarea
              rows={3}
              value={values.description}
              onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Status</label>
              <select
                value={values.status}
                onChange={(e) => setValues((prev) => ({ ...prev, status: e.target.value }))}
                className="input"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Due Date</label>
              <input
                type="date"
                value={values.dueDate}
                onChange={(e) => setValues((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Payment</label>
            <div className="flex gap-4 text-sm text-foreground">
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  name="requiresPayment"
                  checked={values.requiresPayment === true}
                  onChange={() => setValues((prev) => ({ ...prev, requiresPayment: true }))}
                />
                Payment required
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  name="requiresPayment"
                  checked={values.requiresPayment === false}
                  onChange={() => setValues((prev) => ({ ...prev, requiresPayment: false }))}
                />
                Not required
              </label>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Assigned To
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {values.assignees.map((name) => (
                <span
                  key={name}
                  className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-foreground"
                >
                  {name}
                  <button type="button" onClick={() => handleRemoveAssignee(name)} aria-label={`Remove ${name}`}>
                    <X size={11} />
                  </button>
                </span>
              ))}
              <input
                value={assigneeDraft}
                onChange={(e) => setAssigneeDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddAssignee();
                  }
                }}
                placeholder="Add name, press Enter"
                className="w-44 rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Add one or more people working on this.</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving…" : task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
