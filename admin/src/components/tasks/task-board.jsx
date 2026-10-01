"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";
import { refreshAdminData } from "@/app/actions";
import { TaskFormModal } from "@/components/tasks/task-form-modal";

const STATUS_STYLES = {
  PENDING: "bg-muted text-muted-foreground",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" });

export function TaskBoard({ initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [modalTask, setModalTask] = useState(undefined); // undefined = closed, null = create, task = edit
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  function handleSaved(saved) {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === saved.id);
      return exists ? prev.map((t) => (t.id === saved.id ? saved : t)) : [saved, ...prev];
    });
    setModalTask(undefined);
    // Local state is already correct; this just clears the stale client
    // cache so revisiting the page shows the change. Not awaited on purpose.
    refreshAdminData();
  }

  async function handleDelete(task) {
    if (!confirm(`Delete task "${task.title}"? This cannot be undone.`)) return;
    setDeletingId(task.id);
    setError("");
    // Optimistic: drop the row now, put it back if the request fails.
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    try {
      await api.deleteTask(task.id);
      refreshAdminData();
    } catch (err) {
      setTasks(previous);
      setError(err instanceof ApiRequestError ? err.message : "Failed to delete task.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setModalTask(null)}
          className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90"
        >
          <Plus size={15} />
          Add Task
        </button>
      </div>

      {error && (
        <p className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No tasks yet. New orders create one automatically, or add one manually above.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{task.title}</p>
                    {task.description && (
                      <p className="mt-0.5 max-w-xs truncate text-xs text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {task.order ? (
                      <Link href={`/orders/${task.order.id}`} className="text-brand hover:underline">
                        {task.order.orderNumber}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {task.assignees.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {task.assignees.map((name) => (
                          <span
                            key={name}
                            className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        task.requiresPayment
                          ? "bg-amber-100 text-amber-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {task.requiresPayment ? "Required" : "Not required"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {task.dueDate ? dateFormatter.format(new Date(task.dueDate)) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setModalTask(task)}
                        className="flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(task)}
                        disabled={deletingId === task.id}
                        className="flex items-center gap-1 text-sm font-medium text-destructive hover:underline disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        {deletingId === task.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalTask !== undefined && (
        <TaskFormModal
          task={modalTask}
          onClose={() => setModalTask(undefined)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
