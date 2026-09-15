import { prisma } from "../lib/prisma.js";

// Read-only for now — no admin-side workflow exists yet to create/attach a
// proof to an order (see server/README.md). Genuinely empty per user
// until that's built.
export async function listProofs(req, res) {
  const proofs = await prisma.proof.findMany({
    where: { userId: req.userId },
    orderBy: { submittedAt: "desc" },
  });
  res.json({ success: true, data: proofs });
}
