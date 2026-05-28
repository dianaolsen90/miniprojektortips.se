import { readFileSync, writeFileSync, readdirSync } from "fs";

const NAV_BTN =
  /<button class="nav-newsletter" type="button">Nyhetsbrev<\/button>/g;
const NAV_LINK = '<a href="nyhetsbrev.html" class="nav-newsletter">Nyhetsbrev</a>';

const FOOTER_BROKEN =
  /<div class="foot-bottom-links"><a href="#">Om oss<\/a><span>·<\/span><a href="#">Kontakt<\/a><span>·<\/span><a href="#">Integritetspolicy<\/a><\/div>/g;
const FOOTER_FIXED =
  '<div class="foot-bottom-links"><a href="om-oss.html">Om oss</a><span> · </span><a href="kontakt.html">Kontakt</a><span> · </span><a href="integritetspolicy.html">Integritetspolicy</a></div>';

for (const file of readdirSync(".").filter((f) => f.endsWith(".html"))) {
  let html = readFileSync(file, "utf8");
  const before = html;
  html = html.replace(NAV_BTN, NAV_LINK);
  html = html.replace(FOOTER_BROKEN, FOOTER_FIXED);
  if (html !== before) {
    writeFileSync(file, html, "utf8");
    console.log("Fixed", file);
  }
}

console.log("Done.");
