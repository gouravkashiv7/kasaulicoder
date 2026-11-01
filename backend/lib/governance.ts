// Voting rules for policies and expenses. Pure module: no imports.

// Every director must approve a policy (capped at the number of directors)
export const APPROVALS_REQUIRED = 3;

export type PolicyOutcome = "proposed" | "approved" | "rejected";

// Passes once enough directors say yes; rejected once enough say no that the
// required number of yes votes can no longer be reached.
export function evaluatePolicy(
  votes: Array<{ vote: "yes" | "no" }>,
  directorCount: number,
  required: number = APPROVALS_REQUIRED,
): PolicyOutcome {
  const needed = Math.min(required, directorCount);
  const yes = votes.filter((v) => v.vote === "yes").length;
  const no = votes.filter((v) => v.vote === "no").length;
  if (yes >= needed) return "approved";
  if (no > directorCount - needed) return "rejected";
  return "proposed";
}

export type ExpenseOutcome = "pending" | "approved" | "rejected";

// Every other director must approve; one rejection ends it. The requester's
// own vote and votes from non-directors never count.
export function evaluateExpense(
  approvals: Array<{ staff: string; decision: "approve" | "reject" }>,
  requesterId: string,
  directorIds: string[],
): ExpenseOutcome {
  const approvers = directorIds.filter((id) => id !== requesterId);
  if (approvers.length === 0) return "pending";
  const decisions = approvals.filter((a) => approvers.includes(a.staff));
  if (decisions.some((a) => a.decision === "reject")) return "rejected";
  const approved = new Set(
    decisions.filter((a) => a.decision === "approve").map((a) => a.staff),
  );
  return approvers.every((id) => approved.has(id)) ? "approved" : "pending";
}
