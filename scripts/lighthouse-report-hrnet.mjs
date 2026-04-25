/**
 * Generates Lighthouse HTML + JSON reports for the original jQuery HRNet app.
 * Spins up a temporary static file server for HRNet-original/, audits both
 * pages, then shuts the server down.
 *
 * Usage: node scripts/lighthouse-report-hrnet.mjs
 */
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createNetServer } from 'node:net';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, extname } from 'node:path';

const HRNET_DIR = resolve('./HRNet-original');
const ROUTES = ['/', '/employee-list.html'];

const PORT = await new Promise((res) => {
  const srv = createNetServer();
  srv.listen(0, () => { const { port } = srv.address(); srv.close(() => res(port)); });
});
const BASE_URL = `http://localhost:${PORT}`;
const OUT_DIR = resolve('./lighthouse-reports/hrnet');
const RUNS = 3;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
};

const server = createHttpServer((req, res) => {
  const urlPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = resolve(HRNET_DIR, `.${urlPath}`);
  try {
    const data = readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

await new Promise((r) => server.listen(PORT, r));
console.log(`Serving HRNet-original on ${BASE_URL}\n`);

mkdirSync(OUT_DIR, { recursive: true });

for (const route of ROUTES) {
  const slug = `hrnet-${route === '/' ? 'home' : route.replace(/\//g, '').replace('.html', '')}`;
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

server.close();
console.log('Reports saved to lighthouse-reports/hrnet/');
process.exit(0);
