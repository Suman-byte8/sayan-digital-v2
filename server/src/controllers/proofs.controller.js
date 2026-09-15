import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";

// List/approve are real - a customer can approve a proof once one exists -
// but nothing creates one yet: no admin-side workflow to attach a proof to
// an order (see server/README.md). Genuinely empty per user until that's
// built, not seeded/fake.
export async function listProofs(req, res) {
  const proofs = await prisma.proof.findMany({
    where: { userId: req.userId },
    orderBy: { submittedAt: "desc" },
  });
  res.json({ success: true, data: proofs });
}

export async function approveProof(req, res) {
  const { id } = req.validated.params;

  const { count } = await prisma.proof.updateMany({
    where: { id, userId: req.userId, status: "PENDING" },
    data: { status: "APPROVED", approvedAt: new Date() },
  });

  if (count === 0) {
    const exists = await prisma.proof.findFirst({ where: { id, userId: req.userId } });
    throw new ApiError(exists ? 409 : 404, exists ? "Proof is not pending approval" : "Proof not found");
  }

  const proof = await prisma.proof.findUnique({ where: { id } });
  res.json({ success: true, data: proof });
}
