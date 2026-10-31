import assert from "node:assert/strict";
import { test } from "node:test";
import { formatINR, splitPaise, toPaise } from "../money.ts";

test("toPaise parses rupee strings exactly", () => {
  assert.equal(toPaise("100"), 10000);
  assert.equal(toPaise("100.01"), 10001);
  assert.equal(toPaise("0.1"), 10);
  assert.equal(toPaise(19.99), 1999);
});

test("toPaise rejects bad input", () => {
  for (const bad of ["", "abc", "-5", "0", "1.234", NaN, Infinity, -1, 0]) {
    assert.equal(toPaise(bad as string | number), null, String(bad));
  }
});

test("toPaise enforces a ceiling", () => {
  assert.equal(toPaise("100000001"), null);
  assert.equal(toPaise("100000000"), 10000000000);
});

test("formatINR uses Indian grouping", () => {
  assert.equal(formatINR(123456789), "₹12,34,567.89");
  assert.equal(formatINR(0), "₹0.00");
});

test("splitPaise always sums to the total", () => {
  const directors = [
    { id: "a", bps: 2667 },
    { id: "b", bps: 2667 },
    { id: "c", bps: 2666 },
  ];
  for (const total of [1, 7, 10001, 99999, 123456789]) {
    const r = splitPaise(total, 2000, directors);
    const sum = r.companyPaise + r.shares.reduce((s, x) => s + x.paise, 0);
    assert.equal(sum, total, `total ${total}`);
  }
});

test("splitPaise gives rounding leftovers to the company", () => {
  const r = splitPaise(10001, 0, [
    { id: "a", bps: 3334 },
    { id: "b", bps: 3333 },
    { id: "c", bps: 3333 },
  ]);
  assert.deepEqual(
    r.shares.map((s) => s.paise),
    [3334, 3333, 3333],
  );
  assert.equal(r.companyPaise, 1);
});

test("splitPaise 20% company / 80% equal", () => {
  const r = splitPaise(100000, 2000, [
    { id: "a", bps: 2667 },
    { id: "b", bps: 2667 },
    { id: "c", bps: 2666 },
  ]);
  assert.equal(r.shares[0].paise, 26670);
  assert.equal(r.shares[2].paise, 26660);
  assert.equal(r.companyPaise, 20000);
});

test("splitPaise rejects percentages that do not total 100", () => {
  assert.throws(() => splitPaise(1000, 2000, [{ id: "a", bps: 5000 }]));
});
