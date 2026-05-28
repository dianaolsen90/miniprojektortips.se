import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DIR = path.dirname(fileURLToPath(import.meta.url));

/** Prefix before colon in h1 / card-title (2026 already in meta for some). */
const TITLE_PREFIX = {
  'minilux-pro.html': 'MiniLux Pro recension 2026',
  'minilux-pro-2.html': 'MiniLux Pro 2 recension 2026',
  'minilux-pro-omdome.html': 'MiniLux Pro omdöme 2026',
  'minilux-pro-2-omdome.html': 'MiniLux Pro 2 omdöme 2026',
  'minilux-pro-test.html': 'MiniLux Pro testad 2026',
  'hemmabio-setup-guide.html': 'Bygg ditt hemmabio från grunden 2026',
  'dolby-atmos-hemma.html': 'Dolby Atmos hemma 2026',
  '4k-vs-1080p-projektor.html': '4K eller 1080P projektor 2026',
  'streaming-kvalitet-guide.html': 'Streamingkvalitet 2026',
  'projektor-utomhus.html': 'Utomhusbio på terrassen 2026',
  'hdmi-kablar-sanning.html': 'HDMI-kablar 2026',
  'projektor-eller-oled.html': 'Projektor eller OLED-TV 2026',
  'ljusstyrka-projektor.html': 'Ljusstyrka projektor 2026',
  'duk-eller-vagg.html': 'Projiceringsduk eller vägg 2026',
  'hemmabio-barn.html': 'Projektor för barnfamiljen 2026',
  'minilux-vs-pro.html': 'MiniLux Pro vs MiniLux Pro 2 2026',
  'wifi-streaming-projektor.html': 'WiFi och streaming projektor 2026',
  'sovrumsprojektor-guide.html': 'Sovrumsprojektor guide 2026',
  'hdr-forklarat.html': 'HDR förklarat 2026',
  'bluetooth-hogtalare-projektor.html': 'Bluetooth-högtalare till projektor 2026',
  'miniprojektor-se-recension.html': 'Miniprojektor.se recension 2026',
  'miniprojektor-se-omdome.html': 'Miniprojektor.se omdöme 2026',
};

const DATES = {
  'miniprojektor-se-omdome.html': '27 maj 2026',
  'miniprojektor-se-recension.html': '25 maj 2026',
  'minilux-pro-2.html': '22 maj 2026',
  'minilux-pro-2-omdome.html': '20 maj 2026',
  'basta-miniprojektorer-2026.html': '18 maj 2026',
  'minilux-pro.html': '15 maj 2026',
  'minilux-pro-omdome.html': '12 maj 2026',
  'minilux-pro-test.html': '10 maj 2026',
  'hemmabio-setup-guide.html': '7 maj 2026',
  'soundbar-guide-2026.html': '4 maj 2026',
  'dolby-atmos-hemma.html': '1 maj 2026',
  '4k-vs-1080p-projektor.html': '28 apr 2026',
  'streaming-kvalitet-guide.html': '25 apr 2026',
  'projektor-utomhus.html': '22 apr 2026',
  'projektor-eller-oled.html': '19 apr 2026',
  'hdmi-kablar-sanning.html': '16 apr 2026',
  'ljusstyrka-projektor.html': '13 apr 2026',
  'minilux-vs-pro.html': '10 apr 2026',
  'sovrumsprojektor-guide.html': '7 apr 2026',
  'hemmabio-barn.html': '4 apr 2026',
  'duk-eller-vagg.html': '2 apr 2026',
  'wifi-streaming-projektor.html': '1 apr 2026',
  'hdr-forklarat.html': '1 apr 2026',
  'bluetooth-hogtalare-projektor.html': '1 apr 2026',
};

const SKIP_TITLE = new Set([
  'index.html',
  'om-oss.html',
  'kontakt.html',
  'integritetspolicy.html',
  'nyhetsbrev.html',
]);

function add2026ToTitle(text, prefix) {
  if (!text || /2026/i.test(text)) return text;
  const colon = text.indexOf(':');
  if (colon === -1) return `${prefix}: ${text}`;
  const head = text.slice(0, colon).trim();
  const tail = text.slice(colon + 1).trim();
  if (head.toLowerCase().includes('2026')) return text;
  return `${prefix}: ${tail}`;
}

function updateArticleFile(filePath, base) {
  if (!fs.existsSync(filePath)) return false;
  let s = fs.readFileSync(filePath, 'utf8');
  const orig = s;
  const prefix = TITLE_PREFIX[base];
  if (prefix) {
    const h1m = s.match(/<h1>([^<]*)<\/h1>/);
    if (h1m) {
      const newH1 = add2026ToTitle(h1m[1], prefix);
      s = s.replace(/<h1>[^<]*<\/h1>/, `<h1>${newH1}</h1>`);
    }
    const titlem = s.match(/<title>([^<]*)<\/title>/);
    if (titlem && !/2026/i.test(titlem[1])) {
      const t = titlem[1].replace(/\s*\|\s*HemmaBioGuiden\s*$/, '');
      const newT = add2026ToTitle(t, prefix);
      s = s.replace(/<title>[^<]*<\/title>/, `<title>${newT} | HemmaBioGuiden</title>`);
    }
  }
  const date = DATES[base];
  if (date) {
    s = s.replace(
      /<div class="meta-bar">([\s\S]*?)<span>\d{1,2} (?:jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec) 2026<\/span>/,
      (m, inner) => m.replace(/<span>\d{1,2} (?:jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec) 2026<\/span>/, `<span>${date}</span>`)
    );
  }
  if (s !== orig) {
    fs.writeFileSync(filePath, s);
    return true;
  }
  return false;
}

function updateAllDatesInFolder() {
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.html'));
  let changed = 0;
  for (const file of files) {
    let s = fs.readFileSync(path.join(DIR, file), 'utf8');
    const orig = s;
    for (const [slug, date] of Object.entries(DATES)) {
      const href = slug.replace(/^\//, '');
      if (!s.includes(href)) continue;
      const re = new RegExp(
        `(href="${href.replace(/\./g, '\\.')}"[^>]*>[\\s\\S]*?)(\\d{1,2} (?:jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec) 2026)`,
        'g'
      );
      s = s.replace(re, `$1${date}`);
      const re2 = new RegExp(
        `(href="${href.replace(/\./g, '\\.')}"[^>]*>[\\s\\S]*?card-meta">[^·]*·\\s*)(\\d{1,2} (?:jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec) 2026)`,
        'g'
      );
      s = s.replace(re2, `$1${date}`);
      const re3 = new RegExp(
        `(href="${href.replace(/\./g, '\\.')}"[^>]*>[\\s\\S]*?sb-item-meta">[^·]*·\\s*)(\\d{1,2} (?:jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec) 2026)`,
        'g'
      );
      s = s.replace(re3, `$1${date}`);
    }
    if (s !== orig) {
      fs.writeFileSync(path.join(DIR, file), s);
      changed++;
      console.log('dates in', file);
    }
  }
  return changed;
}

function updateCardsAndSidebars() {
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.html'));
  for (const file of files) {
    let s = fs.readFileSync(path.join(DIR, file), 'utf8');
    const orig = s;
    for (const [slug, prefix] of Object.entries(TITLE_PREFIX)) {
      if (!s.includes(slug)) continue;
      const reCard = new RegExp(
        `(href="${slug.replace(/\./g, '\\.')}"[^>]*>[\\s\\S]*?<div class="card-title">)([^<]+)(</div>)`,
        'g'
      );
      s = s.replace(reCard, (_, a, title, c) => {
        const nt = add2026ToTitle(title, prefix);
        return nt === title ? `${a}${title}${c}` : `${a}${nt}${c}`;
      });
    }
    if (s !== orig) {
      fs.writeFileSync(path.join(DIR, file), s);
      console.log('cards in', file);
    }
  }
}

let n = 0;
for (const base of Object.keys(TITLE_PREFIX)) {
  if (SKIP_TITLE.has(base)) continue;
  if (updateArticleFile(path.join(DIR, base), base)) {
    console.log('article', base);
    n++;
  }
}
updateCardsAndSidebars();
updateAllDatesInFolder();
console.log('updated articles:', n);
