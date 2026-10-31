import assert from "node:assert/strict";
import { test } from "node:test";
import {
  APPROVALS_REQUIRED,
  evaluateExpense,
  evaluatePolicy,
} from "../governance.ts";

test("two approvals are required", () => {
  assert.equal(APPROVALS_REQUIRED, 2);
});

test("policy stays proposed with a single yes", () => {
  assert.equal(evaluatePolicy([{ vote: "yes" }], 3), "proposed");
});

test("policy passes at two yes votes", () => {
  assert.equal(
    evaluatePolicy([{ vote: "yes" }, { vote: "yes" }], 3),
    "approved",
  );
});

test("policy is rejected once approval is impossible", () => {
  assert.equal(
    evaluatePolicy([{ vote: "yes" }, { vote: "no" }, { vote: "no" }], 3),
    "rejected",
  );
  assert.equal(
    evaluatePolicy([{ vote: "yes" }, { vote: "no" }], 3),
    "proposed",
  );
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
