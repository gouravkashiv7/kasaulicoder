import assert from "node:assert/strict";
import { test } from "node:test";
import {
  annualPrice,
  buildTiers,
  bundleBuildPrice,
  currencyForCountry,
  discounts,
  formatPrice,
  managedPlans,
} from "../../../lib/pricing.ts";

test("India maps to INR, everything else to USD", () => {
  assert.equal(currencyForCountry("IN"), "INR");
  assert.equal(currencyForCountry("in"), "INR");
  for (const c of ["US", "", null, undefined]) {
    assert.equal(currencyForCountry(c), "USD");
  }
});

test("formatPrice uses Indian grouping for INR and keeps the plus", () => {
  assert.equal(formatPrice(250000, "INR", true), "₹2,50,000+");
  assert.equal(formatPrice(5500, "USD", true), "$5,500+");
  assert.equal(formatPrice(899, "USD"), "$899");
});

test("annual price is ten months, bundle is ten percent off", () => {
  assert.equal(annualPrice(2999), 29990);
  assert.equal(annualPrice(59), 590);
  assert.equal(bundleBuildPrice(39999), 35999);
});

test("build tier prices match the approved table", () => {
  const got = Object.fromEntries(
    buildTiers.map((t) => [t.id, [t.price.INR, t.price.USD]]),
  );
  assert.deepEqual(got, {
    launch: [14999, 349],
    business: [39999, 899],
    growth: [89999, 1999],
    saas: [250000, 5500],
  });
  assert.equal(buildTiers.filter((t) => t.popular).length, 1);
  assert.equal(buildTiers.find((t) => t.popular)?.id, "business");
});

test("managed plan prices match the approved table", () => {
  const got = Object.fromEntries(
    managedPlans.map((p) => [p.id, [p.monthly.INR, p.monthly.USD]]),
  );
  assert.deepEqual(got, {
    care: [2999, 59],
    grow: [9999, 199],
    scale: [24999, 499],
  });
});

test("launch offer is off until a real slot count is set", () => {
  assert.equal(discounts.launchOffer.slotsLeft, null);
});
