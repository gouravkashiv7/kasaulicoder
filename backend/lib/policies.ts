import { NOT_DELETED } from "@/backend/lib/softDelete";
import Policy from "@/backend/models/Policy";

// Moves a still-open policy to its final status exactly once; an approved
// policy replaces the client's previously active one.
export async function applyOutcome(
  id: string,
  client: string,
  status: "approved" | "rejected",
) {
  const res = await Policy.updateOne(
    { _id: id, status: "proposed" },
    { $set: { status, decidedAt: new Date() } },
  );
  // Policies from before clients were required have none, so replace nothing.
  if (res.modifiedCount === 1 && status === "approved" && client) {
    await Policy.updateMany(
      { _id: { $ne: id }, client, type: "finance", status: "approved" },
      { $set: { status: "superseded" } },
    );
  }
}

// The finance policy currently in force for a client, or null if none has been
// approved.
export async function getActiveSplit(client: string) {
  return Policy.findOne({
    client,
    type: "finance",
    status: "approved",
    ...NOT_DELETED,
  })
    .sort({ decidedAt: -1 })
    .lean();
}
