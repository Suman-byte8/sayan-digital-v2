import { TablePageSkeleton } from "@/components/ui/skeleton";

// Default for every list page; routes with a different shape override below.
export default function Loading() {
  return <TablePageSkeleton />;
}
