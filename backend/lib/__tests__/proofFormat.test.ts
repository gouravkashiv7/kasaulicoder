import assert from "node:assert/strict";
import { test } from "node:test";
import { domainName, parseProofDataUrl } from "../proofFormat.ts";

const url = (mime: string, bytes: Buffer) =>
  `data:${mime};base64,${bytes.toString("base64")}`;
const png = (size = 16) =>
  Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47]),
    Buffer.alloc(size - 4),
  ]);
const jpeg = (size = 16) =>
  Buffer.concat([Buffer.from([0xff, 0xd8]), Buffer.alloc(size - 2)]);
const pdf = (size = 16) =>
  Buffer.concat([Buffer.from("%PDF-"), Buffer.alloc(size - 5)]);

test("accepts PNG, JPEG and PDF whose bytes match", () => {
  for (const [mime, bytes] of [
    ["image/png", png()],
    ["image/jpeg", jpeg()],
    ["application/pdf", pdf()],
  ] as const) {
    const res = parseProofDataUrl(url(mime, bytes));
    assert.ok("data" in res, mime);
    assert.equal(res.mime, mime);
  }
});

test("rejects a declared type that doesn't match the bytes", () => {
  assert.ok("error" in parseProofDataUrl(url("application/pdf", png())));
  assert.ok("error" in parseProofDataUrl(url("image/png", pdf())));
  assert.ok("error" in parseProofDataUrl(url("image/jpeg", png())));
});

test("rejects WebP, GIF and non-data input", () => {
  assert.ok("error" in parseProofDataUrl(url("image/webp", Buffer.alloc(16))));
  assert.ok("error" in parseProofDataUrl(url("image/gif", Buffer.alloc(16))));
  assert.ok("error" in parseProofDataUrl("https://example.com/a.png"));
  assert.ok("error" in parseProofDataUrl(undefined));
});

test("size caps: 1 MB for images, 3 MB for PDFs", () => {
  const MB = 1024 * 1024;
  assert.ok("data" in parseProofDataUrl(url("image/png", png(MB))));
  assert.ok("error" in parseProofDataUrl(url("image/png", png(MB + 1))));
  assert.ok("data" in parseProofDataUrl(url("application/pdf", pdf(3 * MB))));
  assert.ok(
    "error" in parseProofDataUrl(url("application/pdf", pdf(3 * MB + 1))),
  );
});

test("domainName normalises and rejects", () => {
  assert.equal(domainName(" HTTPS://WWW.Example.COM/path "), "www.example.com");
  assert.equal(domainName("kasaulicoder.com"), "kasaulicoder.com");
  assert.equal(domainName("sub.domain.co.in:8080/x?y"), "sub.domain.co.in");
  for (const bad of ["not a domain", "", "nodot", "-bad.com", "a..com"]) {
    assert.equal(domainName(bad), null, bad);
  }
});
