/**
 * Generates Lighthouse HTML + JSON reports for all app routes.
 * Builds the app, starts a Vite preview server on a free port, audits each
 * route 3 times, saves averaged HTML + JSON to lighthouse-reports/app/, then exits.
 *
 * Uses the lighthouse Node API directly to work around a Windows chrome-launcher
 * bug where rmSync on the temp profile dir throws EPERM.
 *
 * Usage: node scripts/lighthouse-report.mjs
 */
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawn, execSync } from 'node:child_process';
import { createServer } from 'node:net';

const ROUTES = ['/', '/employees'];

const freePort = await new Promise((res) => {
  const srv = createServer();
  srv.listen(0, () => { const { port } = srv.address(); srv.close(() => res(port)); });
});
const BASE_URL = `http://localhost:${freePort}`;
const OUT_DIR = resolve('./lighthouse-reports/app');
const RUNS = 3;

console.log('Building…');
execSync('npm run build', { stdio: 'inherit' });

console.log('\nStarting preview server…');
const viteBin = resolve('./node_modules/.bin/vite.cmd');
const preview = spawn(`"${viteBin}" preview --port ${freePort}`, { shell: true, stdio: 'pipe' });

await new Promise((resolveReady, reject) => {
  // Vite uses ANSI colour codes — strip them before matching
  const onData = (data) => {
    process.stdout.write(data);
    const plain = data.toString().replace(/\x1B\[[0-9;]*m/g, '');
    if (plain.includes('Local:')) resolveReady();
  };
  preview.stdout.on('data', onData);
  preview.stderr.on('data', onData);
  preview.on('error', reject);
  // Fallback: if we somehow miss the ready signal, continue after 5 s
  setTimeout(resolveReady, 5000);
});

console.log();
mkdirSync(OUT_DIR, { recursive: true });

for (const route of ROUTES) {
  const slug = route === '/' ? 'home' : route.replace(/\//g, '');
  const scores = { performance: [], accessibility: [], bestPractices: [], seo: [] };
  let lastResult;

  for (let run = 1; run <= RUNS; run++) {
    process.stdout.write(`Auditing ${route} (run ${run}/${RUNS})…`);

    const chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    try {
      const result = await lighthouse(`${BASE_URL}${route}`, {
        port: chrome.port,
        output: ['html', 'json'],
        logLevel: 'silent',
      });
      lastResult = result;
      scores.performance.push(result.lhr.categories.performance.score ?? 0);
      scores.accessibility.push(result.lhr.categories.accessibility.score ?? 0);
      scores.bestPractices.push(result.lhr.categories['best-practices'].score ?? 0);
      scores.seo.push(result.lhr.categories.seo.score ?? 0);
      process.stdout.write(' done\n');
    } finally {
      try {
        await chrome.kill();
      } catch {
        // Windows EPERM on temp dir cleanup — harmless
      }
    }
  }

  const avg = (arr) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
  console.log(
    `  Perf ${avg(scores.performance)} · A11y ${avg(scores.accessibility)} · BP ${avg(scores.bestPractices)} · SEO ${avg(scores.seo)}`,
  );

  if (!lastResult) {
    console.error(`  All runs failed for ${route} — skipping report.\n`);
    continue;
  }

  const ts = new Date().toISOString().slice(0, 10);
  const [htmlReport, jsonReport] = lastResult.report;
  writeFileSync(`${OUT_DIR}/lighthouse-${slug}-${ts}.html`, htmlReport);
  writeFileSync(`${OUT_DIR}/lighthouse-${slug}-${ts}.json`, jsonReport);
  console.log(`  Saved lighthouse-${slug}-${ts}.html + .json\n`);
}

preview.kill();
console.log(`Reports saved to lighthouse-reports/`);
process.exit(0);
