import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
// Use the reader already bundled by the pinned Next.js local-font loader.
const loadFont = require("next/dist/compiled/@next/font/dist/fontkit").default;
test("bundled Vazirmatn covers Sorani-specific letters, Latin capitals and numerals", () => {
  const font = loadFont(fs.readFileSync(new URL("../public/fonts/Vazirmatn-variable.woff2", import.meta.url)));
  const chars = "ڕڵۆێەکگچژABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  assert.deepEqual([...chars].filter(c => !font.hasGlyphForCodePoint(c.codePointAt(0))), []);
  for (const text of ["هەلی کاری گونجاو", "ڕووناک، هەولێر، سلێمانی", "650,000 IQD"]) {
    assert.ok(font.layout(text).glyphs.every(glyph => glyph.id !== 0), text);
  }
  assert.equal(font.variationAxes.wght.min, 100);
  assert.equal(font.variationAxes.wght.max, 900);
  assert.match(fs.readFileSync(new URL("../public/fonts/OFL.txt", import.meta.url), "utf8"), /SIL OPEN FONT LICENSE/);
});
