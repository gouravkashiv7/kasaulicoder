import assert from "node:assert/strict";
import { test } from "node:test";
import {
  APPROVALS_REQUIRED,
  evaluateExpense,
  evaluatePolicy,
} from "../governance.ts";

test("three approvals are required", () => {
  assert.equal(APPROVALS_REQUIRED, 3);
});

test("policy stays proposed until every director has approved", () => {
  assert.equal(evaluatePolicy([{ vote: "yes" }], 3), "proposed");
  assert.equal(
    evaluatePolicy([{ vote: "yes" }, { vote: "yes" }], 3),
    "proposed",
  );
});

test("policy passes at three yes votes", () => {
  assert.equal(
    evaluatePolicy([{ vote: "yes" }, { vote: "yes" }, { vote: "yes" }], 3),
    "approved",
  );
});

test("a single no rejects a policy that needs every director", () => {
  assert.equal(
    evaluatePolicy([{ vote: "yes" }, { vote: "no" }], 3),
    "rejected",
  );
  assert.equal(evaluatePolicy([{ vote: "no" }], 3), "rejected");
});

test("approval threshold never exceeds the number of directors", () => {
  assert.equal(evaluatePolicy([{ vote: "yes" }], 1), "approved");
});

const dirs = ["a", "b", "c"];

test("expense needs every other director", () => {
  assert.equal(evaluateExpense([], "a", dirs), "pending");
  assert.equal(
    evaluateExpense([{ staff: "b", decision: "approve" }], "a", dirs),
    "pending",
  );
  assert.equal(
    evaluateExpense(
      [
        { staff: "b", decision: "approve" },
        { staff: "c", decision: "approve" },
      ],
      "a",
      dirs,
    ),
    "approved",
  );
});

test("requester's own approval does not count", () => {
  assert.equal(
    evaluateExpense(
      [
        { staff: "a", decision: "approve" },
        { staff: "b", decision: "approve" },
      ],
      "a",
      dirs,
    ),
    "pending",
  );
});

test("any rejection by another director rejects the expense", () => {
  assert.equal(
    evaluateExpense(
      [
        { staff: "b", decision: "approve" },
        { staff: "c", decision: "reject" },
      ],
      "a",
      dirs,
    ),
    "rejected",
  );
});

test("votes from non-directors are ignored", () => {
  assert.equal(
    evaluateExpense(
      [
        { staff: "x", decision: "approve" },
        { staff: "y", decision: "approve" },
      ],
      "a",
      dirs,
    ),
    "pending",
  );
});

test("an expense with no other directors can never self-approve", () => {
  assert.equal(evaluateExpense([], "a", ["a"]), "pending");
});

test("with four directors three yes votes pass and two no votes reject", () => {
  const y = { vote: "yes" } as const;
  const n = { vote: "no" } as const;
  assert.equal(evaluatePolicy([y, y, y], 4), "approved");
  assert.equal(evaluatePolicy([y, n], 4), "proposed");
  assert.equal(evaluatePolicy([y, n, n], 4), "rejected");
});
