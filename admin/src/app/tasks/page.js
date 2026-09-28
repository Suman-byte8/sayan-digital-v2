import Link from "next/link";
import { Search } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";
import { TaskBoard } from "@/components/tasks/task-board";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tasks — Sayan Digital Admin",
};

const STATUS_TABS = [
  { value: undefined, label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default async function TasksPage({ searchParams }) {
  const { status, search } = await searchParams;

  let tasks = [];
  let loadError = null;

  try {
    const result = await api.listTasks({ limit: 100, status, search });
    tasks = result.data;
  } catch (error) {
    loadError = error instanceof ApiRequestError ? error.message : "Failed to load tasks.";
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Internal-only work tracking — never shown to customers. New orders create a task
            here automatically.
          </p>
        </div>
        <form action="/tasks" className="relative">
          {status && <input type="hidden" name="status" value={status} />}
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            name="search"
            defaultValue={search ?? ""}
            placeholder="Search tasks…"
            className="w-64 rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
        </form>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.label}
            href={{ pathname: "/tasks", query: { ...(tab.value ? { status: tab.value } : {}), search } }}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              status === tab.value
                ? "bg-brand text-brand-foreground"
                : "bg-muted text-muted-foreground hover:bg-border"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {loadError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {loadError}
        </p>
      ) : (
        <TaskBoard initialTasks={tasks} />
      )}
    </div>
  );
}
