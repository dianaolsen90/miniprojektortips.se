import { readFileSync, writeFileSync, readdirSync } from "fs";

const REPLACEMENTS = [
  ['href="minilux-pro-test.html"><span class="sb-num">01</span><div><div class="sb-item-title">MiniLux Pro test</div><div class="sb-item-meta">Test · 18 jan 2026', 'href="minilux-pro-test.html"><span class="sb-num">01</span><div><div class="sb-item-title">MiniLux Pro test</div><div class="sb-item-meta">Test · 24 maj 2026'],
  ['href="minilux-pro-2-test.html"><span class="sb-num">02</span><div><div class="sb-item-title">MiniLux Pro 2 test</div><div class="sb-item-meta">Test · 5 feb 2026', 'href="minilux-pro-2-test.html"><span class="sb-num">02</span><div><div class="sb-item-title">MiniLux Pro 2 test</div><div class="sb-item-meta">Test · 26 maj 2026'],
  ['href="minilux-vs-pro.html"><span class="sb-num">03</span><div><div class="sb-item-title">MiniLux Pro vs MiniLux Pro 2: vilken ska du välja 2026?</div><div class="sb-item-meta">Jämförelse · 12 feb 2026', 'href="minilux-vs-pro.html"><span class="sb-num">03</span><div><div class="sb-item-title">MiniLux Pro vs MiniLux Pro 2: vilken ska du välja 2026?</div><div class="sb-item-meta">Jämförelse · 22 maj 2026'],
  ['href="projektor-eller-tv.html"><span class="sb-num">04</span><div><div class="sb-item-title">Projektor eller TV</div><div class="sb-item-meta">Guide · 8 feb 2026', 'href="projektor-eller-tv.html"><span class="sb-num">04</span><div><div class="sb-item-title">Projektor eller TV</div><div class="sb-item-meta">Guide · 12 maj 2026'],
  ['href="ansi-lumen.html"><span class="sb-num">05</span><div><div class="sb-item-title">ANSI Lumen guide</div><div class="sb-item-meta">Teknik · 25 jan 2026', 'href="ansi-lumen.html"><span class="sb-num">05</span><div><div class="sb-item-title">ANSI Lumen guide</div><div class="sb-item-meta">Teknik · 24 april 2026'],
];

for (const file of readdirSync(".").filter((f) => f.endsWith(".html"))) {
  let html = readFileSync(file, "utf8");
  const before = html;
  for (const [from, to] of REPLACEMENTS) {
    html = html.split(from).join(to);
  }
  if (html !== before) {
    writeFileSync(file, html, "utf8");
    console.log("Fixed", file);
  }
}
