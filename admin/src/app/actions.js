"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Called after every admin write. Revalidating the root layout both
// re-renders the current page with fresh data (in the same round trip as
// this call) AND clears the client-side router cache for every other page,
// so a cached list/detail can never show pre-edit data afterwards.
// Pass `redirectTo` to navigate in that same round trip (e.g. after saving
// a form or deleting the record whose page you're on).
export async function refreshAdminData(redirectTo) {
  revalidatePath("/", "layout");
  if (redirectTo) redirect(redirectTo);
}
