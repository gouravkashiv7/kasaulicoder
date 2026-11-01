import assert from "node:assert/strict";
import fs from "node:fs";

const BASE = "http://localhost:3000";
// argv[2] is the folder seed.cjs wrote e2e-password.txt into
const password = fs.readFileSync(`${process.argv[2]}/e2e-password.txt`, "utf8");
const PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

async function login(who) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: `e2e-${who}@e2e.kasaulicoder.test`,
      password,
      loginType: "admin",
    }),
  });
  assert.equal(res.status, 200, `login ${who}`);
  const cookie = res.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
  return async (path, method = "GET", body) => {
    const r = await fetch(`${BASE}/api/director/${path}`, {
      method,
      headers: { "Content-Type": "application/json", cookie },
      body: body ? JSON.stringify(body) : undefined,
    });
    const type = r.headers.get("content-type") || "";
    return {
      status: r.status,
      body: type.includes("json") ? await r.json() : null,
      type,
    };
  };
}

let n = 0;
const ok = (name) => console.log(`ok ${++n} - ${name}`);

const A = await login("a"),
  B = await login("b"),
  C = await login("c"),
  X = await login("x");
const ids = {};

// Access control
assert.equal((await fetch(`${BASE}/api/director/policies`)).status, 401);
for (const p of [
  "policies",
  "finance/summary",
  "finance/payments",
  "finance/expenses",
  "finance/clients",
  "discussions",
  "badges",
]) {
  assert.equal((await X(p)).status, 403, p);
}
ok("anonymous gets 401, non-director gets 403 on every area");

// Payment blocked before a split exists
const client = (await A("finance/clients", "POST", { name: "E2E Client" }))
  .body;
let r = await A("finance/payments", "POST", {
  clientId: client._id,
  amount: "100",
  receivedOn: "2026-10-01",
});
assert.equal(r.status, 409);
ok("payment blocked until the client has an approved finance policy");

// Policy: split must total 100
const dirs = (await A("policies")).body.directors;
assert.equal(dirs.length, 3);
const mk = (company, pcts) => ({
  clientId: client._id,
  title: "E2E split",
  body: "e2e",
  split: {
    companyPercent: company,
    directors: dirs.map((d, i) => ({ staff: d.id, percent: pcts[i] })),
  },
});
r = await A("policies", "POST", mk("20", ["26.67", "26.67", "26.67"]));
assert.equal(r.status, 400);
ok("split not totalling 100% is rejected");

r = await A("policies", "POST", mk("20", ["26.67", "26.67", "26.66"]));
assert.equal(r.status, 201);
ids.split1 = r.body.id;
let pol = (await B("policies")).body.policies.find((p) => p._id === ids.split1);
assert.equal(pol.status, "proposed");
assert.equal(pol.votes.length, 1);
ok("proposer's vote counts; still open after one approval");

// Concurrent final votes: B and C both approve at once
const [vb, vc] = await Promise.all([
  B(`policies/${ids.split1}/vote`, "POST", { vote: "yes" }),
  C(`policies/${ids.split1}/vote`, "POST", { vote: "yes" }),
]);
assert.equal(vb.body.status, "approved");
assert.equal(vc.body.status, "approved");
pol = (await A("policies")).body.policies.find((p) => p._id === ids.split1);
assert.equal(pol.status, "approved");
ok("two approvals pass the policy, concurrent votes are safe");

// Decided policy ignores later votes
r = await C(`policies/${ids.split1}/vote`, "POST", { vote: "no" });
assert.equal(r.body.status, "approved");
ok("decided policy is final");

// Payment and split
r = await A("finance/payments", "POST", {
  clientId: client._id,
  amount: "100000.01",
  receivedOn: "2026-10-01",
  reference: "UTR1",
  attachmentId: (await A("finance/attachments", "POST", { dataUrl: PNG })).body
    .id,
});
assert.equal(r.status, 201, JSON.stringify(r.body));
const payments = (await B("finance/payments")).body.payments;
const pay = payments.find((p) => p.reference === "UTR1");
const sum =
  pay.allocation.companyPaise +
  pay.allocation.shares.reduce((s, x) => s + x.paise, 0);
assert.equal(sum, 10000001);
ok(
  `payment split sums exactly (company ${pay.allocation.companyPaise}, shares ${pay.allocation.shares.map((s) => s.paise).join("/")})`,
);

// Attachment access
const att = await B(`finance/attachments/${pay.attachment}`);
assert.equal(att.status, 200);
assert.equal(att.type, "image/png");
assert.equal((await X(`finance/attachments/${pay.attachment}`)).status, 403);
r = await A("finance/attachments", "POST", {
  dataUrl: "data:image/png;base64,AAAA",
});
assert.equal(r.status, 400);
r = await A("finance/attachments", "POST", {
  dataUrl: "data:text/html;base64,PGI+",
});
assert.equal(r.status, 400);
ok("screenshots served to directors only; fake/non-image uploads refused");

// Summary
let sm = (await A("finance/summary")).body;
assert.equal(sm.receivedPaise, 10000001);
assert.equal(sm.companyBalancePaise, pay.allocation.companyPaise);
assert.equal(sm.directorShares.length, 3);
ok("summary totals match");

// Expense flow
const shot = (await A("finance/attachments", "POST", { dataUrl: PNG })).body.id;
r = await A("finance/expenses", "POST", {
  purpose: "E2E domain",
  amount: "1500.50",
});
assert.equal(r.status, 400);
r = await A("finance/expenses", "POST", {
  purpose: "E2E domain",
  amount: "1500.50",
  attachmentId: shot,
});
assert.equal(r.status, 201);
ids.exp = r.body.id;
assert.equal(
  (
    await A(`finance/expenses/${ids.exp}/decision`, "POST", {
      decision: "approve",
    })
  ).status,
  403,
);
assert.equal(
  (
    await B(`finance/expenses/${ids.exp}/decision`, "POST", {
      decision: "approve",
    })
  ).body.status,
  "pending",
);
assert.equal(
  (
    await C(`finance/expenses/${ids.exp}/decision`, "POST", {
      decision: "reject",
    })
  ).status,
  400,
);
assert.equal(
  (
    await C(`finance/expenses/${ids.exp}/decision`, "POST", {
      decision: "approve",
    })
  ).body.status,
  "approved",
);
ok("expense needs both other directors; own and reason-less rejects blocked");

assert.equal(
  (await A(`finance/expenses/${ids.exp}/release`, "POST", {})).status,
  409,
);
assert.equal(
  (
    await B(`finance/expenses/${ids.exp}/release`, "POST", {
      reference: "UTR-REL",
    })
  ).status,
  200,
);
assert.equal(
  (await B(`finance/expenses/${ids.exp}/release`, "POST", {})).status,
  409,
);
sm = (await A("finance/summary")).body;
assert.equal(sm.releasedPaise, 150050);
assert.equal(sm.companyBalancePaise, pay.allocation.companyPaise - 150050);
ok("requester can't release own expense; release deducts company balance once");

r = await A("finance/expenses", "POST", {
  purpose: "E2E rejected",
  amount: "10",
  attachmentId: (await A("finance/attachments", "POST", { dataUrl: PNG })).body
    .id,
});
ids.exp2 = r.body.id;
assert.equal(
  (
    await C(`finance/expenses/${ids.exp2}/decision`, "POST", {
      decision: "reject",
      comment: "not needed",
    })
  ).body.status,
  "rejected",
);
ok("a rejection ends an expense");

// General policy rejected by two no votes
r = await C("policies", "POST", { title: "E2E general", body: "no thanks" });
ids.gen = r.body.id;
await A(`policies/${ids.gen}/vote`, "POST", { vote: "no" });
assert.equal(
  (await B(`policies/${ids.gen}/vote`, "POST", { vote: "no" })).body.status,
  "rejected",
);
ok("two no votes reject a policy");

// Second split supersedes the first
r = await A("policies", "POST", mk("10", ["30", "30", "30"]));
ids.split2 = r.body.id;
await B(`policies/${ids.split2}/vote`, "POST", { vote: "yes" });
const all = (await A("policies")).body.policies;
assert.equal(all.find((p) => p._id === ids.split2).status, "approved");
assert.equal(all.find((p) => p._id === ids.split1).status, "superseded");
const pay2 = await A("finance/payments", "POST", {
  clientId: client._id,
  amount: "1000",
  receivedOn: "2026-10-02",
  reference: "UTR2",
});
assert.equal(pay2.status, 201);
const p2 = (await A("finance/payments")).body.payments.find(
  (p) => p.reference === "UTR2",
);
assert.deepEqual(
  p2.allocation.shares.map((s) => s.paise),
  [30000, 30000, 30000],
);
const p1again = (await A("finance/payments")).body.payments.find(
  (p) => p.reference === "UTR1",
);
assert.equal(p1again.allocation.companyPaise, pay.allocation.companyPaise);
ok("new split supersedes old; old payments keep their original shares");

// Void
assert.equal(
  (await A(`finance/payments/${p2._id}/void`, "POST", {})).status,
  400,
);
assert.equal(
  (await A(`finance/payments/${p2._id}/void`, "POST", { reason: "typo" }))
    .status,
  200,
);
assert.equal(
  (await A(`finance/payments/${p2._id}/void`, "POST", { reason: "again" }))
    .status,
  404,
);
sm = (await A("finance/summary")).body;
assert.equal(sm.receivedPaise, 10000001);
ok("void needs a reason, is one-way, and drops out of totals");

// Validation
for (const amount of ["abc", "-5", "1.234", "0", "999999999"]) {
  assert.equal(
    (
      await A("finance/payments", "POST", {
        clientId: client._id,
        amount,
        receivedOn: "2026-10-01",
      })
    ).status,
    400,
    amount,
  );
}
ok("bad amounts rejected");

// Discussions
r = await A("discussions", "POST", {
  title: "E2E thread",
  body: "hello directors",
});
ids.thread = r.body.id;
let list = (await B("discussions")).body;
assert.equal(list.find((t) => t._id === ids.thread).unread, true);
assert.ok((await B("badges")).body.discussions >= 1);
const t = (await B(`discussions/${ids.thread}`)).body;
assert.equal(t.messages.length, 1);
list = (await B("discussions")).body;
assert.equal(list.find((t2) => t2._id === ids.thread).unread, false);
await B(`discussions/${ids.thread}/messages`, "POST", { body: "reply" });
assert.equal(
  (await A("discussions")).body.find((t2) => t2._id === ids.thread).unread,
  true,
);
ok("threads, replies and unread tracking work");

const msgId = t.messages[0]._id;
const e = (body) =>
  A(`discussions/${ids.thread}/email`, "POST", { messageId: msgId, ...body });
assert.equal(
  (await e({ recipientIds: [dirs[1].id], subject: "" })).status,
  400,
);
assert.equal(
  (await e({ recipientIds: [dirs[1].id], subject: "   " })).status,
  400,
);
assert.equal((await e({ recipientIds: [], subject: "Hi" })).status, 400);
assert.equal(
  (await e({ recipientIds: ["000000000000000000000000"], subject: "Hi" }))
    .status,
  400,
);
ok("email refused without subject or valid director recipient");

console.log(`\nall ${n} checks passed`);
