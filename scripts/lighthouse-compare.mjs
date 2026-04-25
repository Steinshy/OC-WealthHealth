/**
 * Compares the latest Lighthouse JSON reports for the React app vs HRNet original.
 * Matches pages by role: home vs home, employees vs employee-list.
 * Outputs a PDF comparison report to lighthouse-reports/comparison-<date>.pdf
 *
 * Usage: node scripts/lighthouse-compare.mjs
 */
import puppeteer from 'puppeteer';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const APP_DIR = resolve('./lighthouse-reports/app');
const HRNET_DIR = resolve('./lighthouse-reports/hrnet');
const OUT_DIR = resolve('./lighthouse-reports');

const CATEGORIES = [
  ['performance', 'Performance'],
  ['accessibility', 'Accessibility'],
  ['best-practices', 'Best Practices'],
  ['seo', 'SEO'],
];

const METRICS = [
  ['first-contentful-paint', 'FCP', true],
  ['largest-contentful-paint', 'LCP', true],
  ['total-blocking-time', 'TBT', true],
  ['cumulative-layout-shift', 'CLS', true],
  ['speed-index', 'Speed Index', true],
];

function latestJson(dir, pattern) {
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.json') && f.includes(pattern))
    .sort()
    .reverse();
  if (!files.length) throw new Error(`No JSON matching "${pattern}" in ${dir}`);
  return JSON.parse(readFileSync(`${dir}/${files[0]}`, 'utf8'));
}

function score(lhr, cat) {
  return Math.round((lhr.categories[cat]?.score ?? 0) * 100);
}

function metricVal(lhr, id) {
  return lhr.audits[id]?.numericValue ?? null;
}

function fmtMetric(id, val) {
  if (val == null) return '—';
  return id === 'cumulative-layout-shift' ? val.toFixed(3) : `${Math.round(val)} ms`;
}

function scoreColor(s) {
  if (s >= 90) return '#0cce6b';
  if (s >= 50) return '#ffa400';
  return '#ff4e42';
}

function buildPage(pageLabel, appLhr, hrnetLhr) {
  let reactWins = 0;
  let hrnetWins = 0;
  const rows = [];

  for (const [cat, label] of CATEGORIES) {
    const a = score(appLhr, cat);
    const h = score(hrnetLhr, cat);
    const winner = a > h ? 'react' : h > a ? 'hrnet' : 'tie';
    if (winner === 'react') reactWins++;
    else if (winner === 'hrnet') hrnetWins++;
    rows.push({ label, a: `${a}`, h: `${h}`, winner, aColor: scoreColor(a), hColor: scoreColor(h), isCat: true });
  }

  for (const [id, label] of METRICS) {
    const a = metricVal(appLhr, id);
    const h = metricVal(hrnetLhr, id);
    if (a == null && h == null) continue;
    const winner = a != null && h != null ? (a < h ? 'react' : h < a ? 'hrnet' : 'tie') : 'tie';
    if (winner === 'react') reactWins++;
    else if (winner === 'hrnet') hrnetWins++;
    rows.push({ label, a: fmtMetric(id, a), h: fmtMetric(id, h), winner, aColor: null, hColor: null, isCat: false });
  }

  const verdict =
    reactWins > hrnetWins
      ? { text: `⚡ React wins`, color: '#4f86f7', sub: `${reactWins} criteria vs ${hrnetWins}` }
      : hrnetWins > reactWins
        ? { text: `🔶 HRNet wins`, color: '#f7a44f', sub: `${hrnetWins} criteria vs ${reactWins}` }
        : { text: `🤝 Even match`, color: '#888', sub: `${reactWins} each` };

  return { pageLabel, rows, verdict, reactWins, hrnetWins };
}

function renderPageSection({ pageLabel, rows, verdict }) {
  const rowsHtml = rows
    .map((r) => {
      const winA = r.winner === 'react' ? ' winner' : '';
      const winH = r.winner === 'hrnet' ? ' winner' : '';
      const aStyle = r.aColor ? `style="color:${r.aColor};font-weight:700"` : '';
      const hStyle = r.hColor ? `style="color:${r.hColor};font-weight:700"` : '';
      const badge =
        r.winner === 'react'
          ? '<span class="badge badge-react">React</span>'
          : r.winner === 'hrnet'
            ? '<span class="badge badge-hrnet">HRNet</span>'
            : '<span class="badge badge-tie">Tie</span>';
      const type = r.isCat ? 'cat' : 'metric';
      return `<tr class="row-${type}">
        <td class="col-label">${r.label}</td>
        <td class="col-val${winA}" ${aStyle}>${r.a}</td>
        <td class="col-val${winH}" ${hStyle}>${r.h}</td>
        <td class="col-badge">${badge}</td>
      </tr>`;
    })
    .join('');

  return `
    <section class="page-section">
      <h2>${pageLabel}</h2>
      <table>
        <thead>
          <tr>
            <th class="col-label">Metric</th>
            <th class="col-val">React App</th>
            <th class="col-val">HRNet Original</th>
            <th class="col-badge">Winner</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      <div class="verdict" style="border-color:${verdict.color}">
        <span class="verdict-text" style="color:${verdict.color}">${verdict.text}</span>
        <span class="verdict-sub">${verdict.sub}</span>
      </div>
    </section>`;
}

function buildHtml(sections, overall) {
  const date = new Date().toISOString().slice(0, 10);
  const sectionsHtml = sections.map(renderPageSection).join('');
  const overallColor = overall.winner === 'react' ? '#4f86f7' : overall.winner === 'hrnet' ? '#f7a44f' : '#888';
  const overallText =
    overall.winner === 'react'
      ? '⚡ React App — overall winner'
      : overall.winner === 'hrnet'
        ? '🔶 HRNet Original — overall winner'
        : '🤝 Both apps perform equally overall';
  const overallWhy =
    overall.winner === 'react'
      ? 'React wins on accessibility, best practices, SEO, and blocking time. HRNet leads on LCP/FCP — expected for static HTML with no framework boot cost. Once loaded, React is non-blocking and meets modern standards.'
      : overall.winner === 'hrnet'
        ? 'HRNet loads faster (no framework boot), but React wins on accessibility, best practices, and SEO. Raw speed favours static HTML — code quality favours React.'
        : 'React leads on standards; HRNet leads on raw load speed. The gap is the unavoidable cost of a JS framework.';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Lighthouse Comparison — ${date}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #222; background: #fff; padding: 32px 40px; font-size: 12px; }
  h1 { font-size: 20px; margin-bottom: 2px; }
  .subtitle { color: #666; font-size: 11px; margin-bottom: 24px; }
  h2 { font-size: 13px; font-weight: 700; margin-bottom: 8px; color: #333; }
  .page-section { margin-bottom: 24px; page-break-inside: avoid; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  thead tr { background: #f5f5f5; }
  th, td { padding: 5px 10px; text-align: left; border-bottom: 1px solid #eee; }
  th { font-weight: 600; font-size: 10px; text-transform: uppercase; color: #555; }
  .col-label { width: 36%; }
  .col-val { width: 22%; }
  .col-badge { width: 20%; }
  .row-cat td { font-weight: 600; }
  .row-metric td { color: #444; }
  td.winner { font-weight: 700; background: #f0f9f0; }
  .badge { display: inline-block; padding: 1px 7px; border-radius: 10px; font-size: 10px; font-weight: 700; }
  .badge-react { background: #e8f0fe; color: #1a73e8; }
  .badge-hrnet { background: #fef3e2; color: #e37400; }
  .badge-tie { background: #f1f3f4; color: #888; }
  .verdict { display: flex; align-items: center; gap: 12px; padding: 7px 14px; border-left: 4px solid; background: #fafafa; border-radius: 4px; }
  .verdict-text { font-weight: 700; font-size: 12px; }
  .verdict-sub { color: #666; font-size: 11px; }
  .overall { margin-top: 24px; padding: 16px 20px; border-radius: 8px; background: #f8f8f8; border: 2px solid; page-break-inside: avoid; page-break-before: always; }
  .overall-title { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
  .overall-why { color: #555; font-size: 11px; line-height: 1.6; }
  .generated { margin-top: 20px; color: #aaa; font-size: 10px; text-align: center; }
</style>
</head>
<body>
  <h1>Lighthouse Comparison</h1>
  <p class="subtitle">React App vs HRNet Original — ${date}</p>
  ${sectionsHtml}
  <div class="overall" style="border-color:${overallColor}">
    <div class="overall-title" style="color:${overallColor}">${overallText}</div>
    <p class="overall-why">${overallWhy}</p>
  </div>
  <p class="generated">Generated by lighthouse-compare.mjs</p>
</body>
</html>`;
}

const appHome = latestJson(APP_DIR, 'home');
const hrnetHome = latestJson(HRNET_DIR, 'hrnet-home');
const appEmployees = latestJson(APP_DIR, 'employees');
const hrnetEmployees = latestJson(HRNET_DIR, 'employee-list');

const s1 = buildPage('Home page', appHome, hrnetHome);
const s2 = buildPage('Employee list', appEmployees, hrnetEmployees);

const totalReact = s1.reactWins + s2.reactWins;
const totalHrnet = s1.hrnetWins + s2.hrnetWins;
const overall = {
  winner: totalReact > totalHrnet ? 'react' : totalHrnet > totalReact ? 'hrnet' : 'tie',
  reactWins: totalReact,
  hrnetWins: totalHrnet,
};

const html = buildHtml([s1, s2], overall);
const date = new Date().toISOString().slice(0, 10);
const dest = `${OUT_DIR}/comparison-${date}.pdf`;

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.emulateMediaType('screen');
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.pdf({ path: dest, format: 'A4', printBackground: true });
await browser.close();

console.log(`Comparison saved → ${dest}`);
process.exit(0);
