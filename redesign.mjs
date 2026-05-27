import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const FONT =
  `<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>`;

const OLD_FONT =
  /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"\/>[\s\S]*?family=Inter[\s\S]*?\/>\n|<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"\/>[\s\S]*?Playfair[\s\S]*?\/>\n/g;

function activeFor(file) {
  const map = {
    "index.html": null,
    "tester.html": "tester.html",
    "guider.html": "guider.html",
    "tips.html": "tips.html",
    "jamforelser.html": "jamforelser.html",
    "teknik.html": "teknik.html",
  };
  if (map[file]) return map[file];
  if (file.includes("minilux") && file.includes("test")) return "tester.html";
  if (
    ["projektor-eller-tv", "sovrum-projektor", "projiceringsduk", "forsta-projektor"].some(
      (x) => file.includes(x)
    )
  )
    return "guider.html";
  if (["utomhusbio"].some((x) => file.includes(x))) return "tips.html";
  if (file.includes("minilux-vs-pro")) return "jamforelser.html";
  if (
    ["ansi-lumen", "wifi-5", "android-projektor", "kontrastratio"].some((x) =>
      file.includes(x)
    )
  )
    return "teknik.html";
  return null;
}

function nav(active) {
  const links = [
    ["tester.html", "Tester"],
    ["guider.html", "Guider"],
    ["tips.html", "Tips"],
    ["jamforelser.html", "Jämförelser"],
    ["teknik.html", "Teknik"],
  ];
  const items = links
    .map(
      ([href, label]) =>
        `<li><a href="${href}"${href === active ? ' class="active"' : ""}>${label}</a></li>`
    )
    .join("");
  return `<nav class="site-nav"><div class="nav-inner">
<a class="nav-brand" href="index.html"><span class="logo-mark">TP</span><span class="logo-text">TeknikPulsen</span></a>
<ul class="nav-links">${items}</ul>
<button class="nav-newsletter" type="button">Nyhetsbrev</button>
</div></nav>`;
}

function footer() {
  return `<footer class="site-footer"><div class="foot-inner"><div class="foot-top">
<div><a class="foot-brand" href="index.html"><span class="logo-mark">TP</span><span class="logo-text">TeknikPulsen</span></a>
<p class="foot-tagline">Oberoende blogg om elektronik, projektorer och smarta hem. Guider, tester och tips från erfarna experter.</p></div>
<div class="foot-col"><h4>Kategorier</h4><ul>
<li><a href="tester.html">Tester</a></li><li><a href="guider.html">Guider</a></li><li><a href="tips.html">Tips</a></li>
<li><a href="jamforelser.html">Jämförelser</a></li><li><a href="teknik.html">Teknik</a></li></ul></div>
<div class="foot-col"><h4>Populära artiklar</h4><ul>
<li><a href="minilux-pro-test.html">MiniLux Pro recension</a></li>
<li><a href="minilux-pro-2-test.html">MiniLux Pro 2 recension</a></li>
<li><a href="minilux-vs-pro.html">MiniLux vs MiniLux Pro</a></li>
<li><a href="projektor-eller-tv.html">Projektor eller TV</a></li>
<li><a href="ansi-lumen.html">ANSI Lumen guide</a></li>
<li><a href="forsta-projektor-tips.html">6 saker innan köp</a></li></ul></div></div>
<p class="foot-bottom">Oberoende teknikblogg &copy; 2026 TeknikPulsen</p></div></footer>`;
}

function sidebarArticle() {
  return `<aside class="article-sidebar">
<div class="sb-block"><div class="sb-title">Mest läst</div><ul class="sb-list">
<li><a class="sb-item" href="minilux-pro-test.html"><span class="sb-num">01</span><div><div class="sb-item-title">MiniLux Pro test</div><div class="sb-item-meta">Test</div></div></a></li>
<li><a class="sb-item" href="minilux-pro-2-test.html"><span class="sb-num">02</span><div><div class="sb-item-title">MiniLux Pro 2 test</div><div class="sb-item-meta">Test</div></div></a></li>
<li><a class="sb-item" href="minilux-vs-pro.html"><span class="sb-num">03</span><div><div class="sb-item-title">MiniLux vs MiniLux Pro</div><div class="sb-item-meta">Jämförelse</div></div></a></li>
<li><a class="sb-item" href="projektor-eller-tv.html"><span class="sb-num">04</span><div><div class="sb-item-title">Projektor eller TV</div><div class="sb-item-meta">Guide</div></div></a></li>
<li><a class="sb-item" href="ansi-lumen.html"><span class="sb-num">05</span><div><div class="sb-item-title">ANSI Lumen guide</div><div class="sb-item-meta">Teknik</div></div></a></li>
</ul></div>
<div class="sb-block"><div class="sb-title">Ämnen</div><div class="tag-cloud">
<a class="tag" href="tester.html">Tester</a><a class="tag" href="guider.html">Guider</a><a class="tag" href="tips.html">Tips</a>
<a class="tag" href="teknik.html">Teknik</a><a class="tag" href="jamforelser.html">Jämförelser</a><a class="tag" href="tester.html">Projektorer</a>
<a class="tag" href="wifi-5-vs-6.html">WiFi</a><a class="tag" href="ansi-lumen.html">4K</a><a class="tag" href="forsta-projektor-tips.html">Ljud</a>
<a class="tag" href="minilux-pro-test.html">Budget</a><a class="tag" href="sovrum-projektor.html">Sovrum</a><a class="tag" href="projektor-eller-tv.html">Hemmabio</a>
</div></div>
<div class="sb-block newsletter-box"><h3>Nyhetsbrev</h3><p>Få nya tester och guider direkt i inkorgen. Ingen spam.</p>
<input type="email" placeholder="din@email.se"/><button type="button">Prenumerera</button></div>
</aside>`;
}

function sidebarHome() {
  return `<aside class="home-sidebar">
<div class="sb-block"><div class="sb-title">Mest läst</div><ul class="sb-list">
<li><a class="sb-item" href="minilux-pro-test.html"><span class="sb-num">01</span><div><div class="sb-item-title">MiniLux Pro test</div><div class="sb-item-meta">Test · 18 jan 2026</div></div></a></li>
<li><a class="sb-item" href="minilux-pro-2-test.html"><span class="sb-num">02</span><div><div class="sb-item-title">MiniLux Pro 2 test</div><div class="sb-item-meta">Test · 5 feb 2026</div></div></a></li>
<li><a class="sb-item" href="minilux-vs-pro.html"><span class="sb-num">03</span><div><div class="sb-item-title">MiniLux vs MiniLux Pro</div><div class="sb-item-meta">Jämförelse · 12 feb 2026</div></div></a></li>
<li><a class="sb-item" href="projektor-eller-tv.html"><span class="sb-num">04</span><div><div class="sb-item-title">Projektor eller TV</div><div class="sb-item-meta">Guide · 8 feb 2026</div></div></a></li>
<li><a class="sb-item" href="ansi-lumen.html"><span class="sb-num">05</span><div><div class="sb-item-title">ANSI Lumen guide</div><div class="sb-item-meta">Teknik · 25 jan 2026</div></div></a></li>
</ul></div>
<div class="sb-block"><div class="sb-title">Ämnen</div><div class="tag-cloud">
<a class="tag" href="tester.html">Tester</a><a class="tag" href="guider.html">Guider</a><a class="tag" href="tips.html">Tips</a>
<a class="tag" href="teknik.html">Teknik</a><a class="tag" href="jamforelser.html">Jämförelser</a><a class="tag" href="tester.html">Projektorer</a>
<a class="tag" href="wifi-5-vs-6.html">WiFi</a><a class="tag" href="ansi-lumen.html">4K</a><a class="tag" href="forsta-projektor-tips.html">Ljud</a>
<a class="tag" href="minilux-pro-test.html">Budget</a><a class="tag" href="sovrum-projektor.html">Sovrum</a><a class="tag" href="projektor-eller-tv.html">Hemmabio</a>
</div></div>
<div class="sb-block newsletter-box"><h3>Nyhetsbrev</h3><p>Få nya tester och guider direkt i inkorgen. Ingen spam.</p>
<input type="email" placeholder="din@email.se"/><button type="button">Prenumerera</button></div>
</aside>`;
}

function stripInlineStyles(html) {
  return html.replace(/<style>[\s\S]*?<\/style>\n?/g, "");
}

function replaceNavFooter(html, file) {
  html = html.replace(/<nav[\s\S]*?<\/nav>\n?/g, nav(activeFor(file)) + "\n");
  html = html.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/g, footer());
  return html;
}

function updateFonts(html) {
  html = html.replace(OLD_FONT, "");
  html = html.replace(
    /<meta name="description"[^/]*\/>\n/,
    (m) => m + FONT + "\n"
  );
  if (!html.includes("site.css")) {
    html = html.replace(FONT + "\n", FONT + `\n<link rel="stylesheet" href="site.css"/>\n`);
  }
  return html;
}

function processArticle(file, html) {
  html = stripInlineStyles(html);
  html = updateFonts(html);
  if (!html.includes("article.css")) {
    html = html.replace(
      '<link rel="stylesheet" href="site.css"/>',
      '<link rel="stylesheet" href="site.css"/>\n<link rel="stylesheet" href="article.css"/>'
    );
  }
  html = replaceNavFooter(html, file);

  const match = html.match(
    /<div class="art-wrap">([\s\S]*)<\/div>\s*<footer class="site-footer">/
  );
  if (!match) return html;
  let content = match[1];

  const authorMatch = content.match(/<div class="bio-name">([^<]+)<\/div>/);
  const initials = authorMatch
    ? authorMatch[1]
        .split(" ")
        .map((w) => w[0])
        .join("")
    : "TP";
  const author = authorMatch ? authorMatch[1] : "TeknikPulsen";
  const postTop = content.match(
    /<div class="post-top">([\s\S]*?)<\/div>/
  );
  let pill = "";
  let date = "";
  let time = "";
  if (postTop) {
    const pillM = postTop[1].match(/<span class="pill[^"]*">([^<]+)<\/span>/);
    const dateM = postTop[1].match(/<span class="post-date">([^<]+)<\/span>/);
    const timeM = postTop[1].match(/<span class="post-readtime">([^<]+)<\/span>/);
    if (pillM) pill = pillM[0];
    date = dateM ? dateM[1] : "";
    time = timeM ? timeM[1] : "";
    content = content.replace(/<div class="post-top">[\s\S]*?<\/div>\n?/, "");
  }

  const metaBar = `<div class="meta-bar"><span class="av-md">${initials}</span><strong>${author}</strong><span class="sep"></span><span>${date}</span><span class="sep"></span><span>${time}</span></div>\n`;
  if (!content.includes("meta-bar")) {
    content = (pill ? pill + "\n" : "") + content;
    content = content.replace(
      /(<p class="intro">[\s\S]*?<\/p>)/,
      `$1\n${metaBar}`
    );
  }

  html = html.replace(
    /<div class="art-wrap">[\s\S]*<\/div>\s*<footer class="site-footer">/,
    `<div class="page-shell"><div class="article-main"><div class="art-wrap">${content}</div></div>${sidebarArticle()}</div>\n<footer class="site-footer">`
  );
  return html;
}

function processCategory(file, html) {
  html = stripInlineStyles(html);
  html = updateFonts(html);
  html = replaceNavFooter(html, file);
  html = html.replace(/class="wrap"/g, 'class="cat-wrap"');
  html = html.replace(/class="grid"/g, 'class="cat-grid"');
  return html;
}

function transformCard(card) {
  const dateMatch = card.match(
    /<div class="card-foot">[\s\S]*?<span>([^<]+)<\/span>\s*<\/div>\s*<\/div>\s*<\/a>/
  );
  const date = dateMatch ? dateMatch[1] : "";
  let c = card.replace(
    /<span class="pill ([^"]+)">([^<]+)<\/span>\s*\n?\s*<div class="card-title">/,
    `<div class="card-top-row"><span class="pill $1">$2</span><span class="card-date">${date}</span></div>\n        <div class="card-title">`
  );
  c = c.replace(
    /<div class="card-foot"><div class="card-auth">([\s\S]*?)<\/div><span>[^<]+<\/span><\/div>/,
    `<div class="card-foot"><div class="card-auth">$1</div></div>`
  );
  return c;
}

function buildIndex() {
  const source = readFileSync("_index_source.html", "utf8");
  const cards = source.match(/<a class="card" href="[^"]+">[\s\S]*?<\/a>/g);
  if (!cards) throw new Error("No cards found");
  const cardHtml = cards.map(transformCard).join("\n");

  return `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>TeknikPulsen | Elektronik, projektorer och smarta hem</title>
<meta name="description" content="Oberoende blogg om elektronik och projektorer. Guider, tester och tips från erfarna experter."/>
${FONT}
<link rel="stylesheet" href="site.css"/>
</head>
<body>
${nav(null)}
<div class="filter-bar">
<a class="filter-pill active" href="index.html">Alla</a>
<a class="filter-pill" href="tester.html">Tester</a>
<a class="filter-pill" href="guider.html">Guider</a>
<a class="filter-pill" href="tips.html">Tips</a>
<a class="filter-pill" href="teknik.html">Teknik</a>
<a class="filter-pill" href="jamforelser.html">Jämförelser</a>
</div>
<div class="home-shell">
<div class="home-main">
<a class="featured-card" href="minilux-pro-test.html">
<div class="featured-text">
<div class="featured-top">
<div class="featured-author-row"><span class="av-sm">PB</span><span>Per Bergman</span><span class="sep"></span><span>18 jan 2026</span><span class="sep"></span><span>13 min</span></div>
<span class="pill p-test">Test</span>
<h2 class="featured-title">MiniLux Pro genomtestad: 200 ANSI och 130 tums bild</h2>
<p class="featured-excerpt">Vi testade MiniLux Pro i fyra veckor. 200 ANSI Lumen, XGA-upplösning och 180 graders roterbar lins. Är den värd 1 499 kr?</p>
</div>
<div class="featured-bottom">
<div class="featured-rating"><span class="stars">★★★★</span><span class="score">4.3</span></div>
<span class="read-link">Läs artikeln</span>
</div>
</div>
<div class="featured-img">[ Produktbild ]</div>
</a>
<div class="cards-grid">
${cardHtml}
</div>
</div>
${sidebarHome()}
</div>
${footer()}
</body>
</html>`;
}

const dir = ".";
const files = readdirSync(dir).filter((f) => f.endsWith(".html"));

for (const file of files) {
  if (file === "index.html") {
    if (!readFileSync("_index_source.html", "utf8")) {
      console.warn("Skip index: missing _index_source.html");
    } else {
      writeFileSync(file, buildIndex(), "utf8");
      console.log("Redesigned", file);
    }
    continue;
  }
  let html = readFileSync(file, "utf8");
  if (html.includes("art-wrap")) {
    html = processArticle(file, html);
  } else if (html.includes("cat-hero") || html.includes('class="grid"')) {
    html = processCategory(file, html);
  } else {
    html = stripInlineStyles(html);
    html = updateFonts(html);
    html = replaceNavFooter(html, file);
  }
  writeFileSync(file, html, "utf8");
  console.log("Redesigned", file);
}
