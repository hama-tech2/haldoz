import test from "node:test";
import assert from "node:assert/strict";
import { validatePage, validHandle, normalizePhone } from "../src/lib/page-validation.ts";
const valid = { handle: "aso-office", display_name: "نووسینگەی ئاسۆ", bio: "", city: "هەولێر", public_phone: "+9647501234567", public_whatsapp: "", brand_tone: "blue", confirm_public: true };
test("page validation rejects reserved/path/Unicode/confusable handles", () => {
  for (const handle of ["admin","auth","a","a-","/other","a?b","ئاسۆ","ＡＢＣ","with space"]) assert.equal(validHandle(handle), false, handle);
  assert.equal(validHandle("aso-office"), true);
  assert.equal(validHandle("a".repeat(33)), false);
});
test("public contact requires explicit consent and never imports account fields", () => {
  assert.deepEqual(validatePage(valid).errors, {});
  assert.ok(validatePage({ ...valid, confirm_public: false }).errors.confirm_public);
  assert.ok(validatePage({ ...valid, public_phone: "", email: "private@example.invalid" }).errors.public_phone);
  assert.equal("email" in validatePage({ ...valid, email: "private@example.invalid", owner_id: "attacker" }).page, false);
  assert.equal("owner_id" in validatePage({ ...valid, owner_id: "attacker" }).page, false);
});
test("server validation limits branding, city, biography and contact schemes", () => {
  assert.ok(validatePage({ ...valid, public_phone: "javascript:alert(1)" }).errors.public_phone);
  assert.ok(validatePage({ ...valid, brand_tone: "url(evil)" }).errors.brand_tone);
  assert.ok(validatePage({ ...valid, city: "unknown" }).errors.city);
  assert.ok(validatePage({ ...valid, bio: "a".repeat(501) }).errors.bio);
  assert.equal(normalizePhone("+964 (750) 123-4567"), "+9647501234567");
  assert.equal(validatePage({ ...valid, handle: " ASO-Office " }).page.handle, "aso-office");
});

test("Iraqi national, international and naturally pasted numbers share one canonical contact", () => {
  for (const input of ["07515298365", "+9647515298365", "9647515298365", "00964 751 529 8365", "0751 529-8365", "+964 (751) 529.8365", "٠٧٥١٥٢٩٨٣٦٥", "۰۷۵۱۵۲۹۸۳۶۵", "\u200f0751–529–8365\u200e"]) {
    const result = validatePage({ ...valid, public_phone: input, whatsapp_enabled: "on", public_whatsapp: "+9647701111111" });
    assert.deepEqual(result.errors, {}, input);
    assert.equal(result.page.public_phone, "+9647515298365", input);
    assert.equal(result.page.public_whatsapp, result.page.public_phone);
  }
});

test("WhatsApp is optional and a forged second number cannot override the single phone", () => {
  for (const enabled of [undefined, false, "false", "off"]) {
    const result = validatePage({ ...valid, whatsapp_enabled: enabled, public_whatsapp: "+9647701111111" });
    assert.equal(result.page.public_whatsapp, "");
    assert.equal(result.page.public_phone, valid.public_phone);
  }
  const enabled = validatePage({ ...valid, whatsapp_enabled: true });
  assert.equal(enabled.page.public_whatsapp, enabled.page.public_phone);
});

test("unusable numbers and extensions cannot produce public call or WhatsApp links", () => {
  for (const input of ["", "0751", "075152983650000", "00000000000", "+9997515298365", "call 07515298365", "07515298365 ext 12", "https://example.invalid/07515298365", "0751+5298365"]) {
    const result = validatePage({ ...valid, public_phone: input, whatsapp_enabled: true });
    assert.ok(result.errors.public_phone, input);
    assert.equal(result.page.public_phone, "");
    assert.equal(result.page.public_whatsapp, "");
  }
});
