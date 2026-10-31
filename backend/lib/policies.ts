import Policy from "@/backend/models/Policy";

// Moves a still-open policy to its final status exactly once; an approved
// revenue split replaces the previously active one.
export async function applyOutcome(
  id: string,
  kind: string,
  status: "approved" | "rejected",
) {
  const res = await Policy.updateOne(
    { _id: id, status: "proposed" },
    { $set: { status, decidedAt: new Date() } },
  );
  if (
    res.modifiedCount === 1 &&
    status === "approved" &&
    kind === "revenue-split"
  ) {
    await Policy.updateMany(
      { _id: { $ne: id }, kind: "revenue-split", status: "approved" },
      { $set: { status: "superseded" } },
    );
  }
}

// The revenue split currently in force, or null if none has been approved.
export async function getActiveSplit() {
  return Policy.findOne({ kind: "revenue-split", status: "approved" })
    .sort({ decidedAt: -1 })
    .lean();
}
