import assert from "node:assert/strict";
import { test } from "node:test";
import { monthKey, monthLabel, monthOptions } from "../months.ts";

test("monthKey reads the UTC month of a date string or Date", () => {
  assert.equal(monthKey("2026-10-31T23:59:59.000Z", true), "2026-10");
  assert.equal(monthKey("2026-11-01T00:00:00.000Z", true), "2026-11");
  assert.equal(monthKey(new Date("2026-01-05T00:00:00Z"), true), "2026-01");
});

test("monthKey is empty for missing or invalid dates", () => {
  assert.equal(monthKey(undefined), "");
  assert.equal(monthKey("not a date"), "");
});

test("monthLabel is readable", () => {
  assert.equal(monthLabel("2026-10"), "October 2026");
  assert.equal(monthLabel("2025-01"), "January 2025");
});

test("monthOptions lists each month once, newest first", () => {
  const items = [
    { d: "2026-09-10T00:00:00Z" },
    { d: "2026-11-02T00:00:00Z" },
    { d: "2026-09-30T00:00:00Z" },
    { d: "2026-10-15T00:00:00Z" },
    { d: undefined },
  ];
  assert.deepEqual(
    monthOptions(items, (i) => i.d, true),
    ["2026-11", "2026-10", "2026-09"],
  );
});
