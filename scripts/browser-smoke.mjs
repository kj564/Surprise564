import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const port = 4178;
const server = spawn('python3', ['-m', 'http.server', String(port), '--directory', 'out'], {
  stdio: 'ignore',
});
let browser;

try {
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/minecraft.html`);
      if (response.ok) { ready = true; break; }
    } catch {}
    await delay(200);
  }
  if (!ready) throw new Error('Static preview server did not become ready');

  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
  const pageErrors = [];
  const consoleErrors = [];
  const textureFailures = [];

  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('response', response => {
    if (response.url().includes('/VoxelCraft/textures/blocks/') && response.status() >= 400) {
      textureFailures.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto(`http://127.0.0.1:${port}/minecraft.html`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => document.querySelector('#loading')?.classList.contains('hidden'), null, { timeout: 90000 });
  await page.waitForSelector('#game');
  await page.waitForFunction(() => document.querySelectorAll('#hotbar .slot').length === 9);

  const canvasVisible = await page.locator('#game').isVisible();
  if (!canvasVisible) throw new Error('Game canvas is not visible');

  await page.keyboard.press('e');
  await page.waitForFunction(() => !document.querySelector('#inventory')?.classList.contains('hidden'));
  const allCount = await page.locator('#invGrid .inv-slot').count();
  if (allCount !== 104) throw new Error(`Expected 104 placeable block slots; found ${allCount}`);

  await page.locator('#inventoryTabBuilding').click();
  const buildingCount = await page.locator('#invGrid .inv-slot').count();
  if (buildingCount < 1 || buildingCount >= allCount) {
    throw new Error(`Building inventory filter returned an implausible count: ${buildingCount}`);
  }

  await page.locator('#inventoryTabItems').click();
  await page.waitForFunction(() => document.querySelector('#invGrid .inv-slot img') !== null, null, { timeout: 15000 });
  const itemCount = await page.locator('#invGrid .inv-slot img').count();
  if (itemCount < 1) throw new Error('Item icon catalog did not render');

  if (textureFailures.length) throw new Error('Block texture requests failed:\\n' + textureFailures.join('\\n'));
  if (pageErrors.length) throw new Error('Uncaught browser exceptions:\\n' + pageErrors.join('\\n'));
  const seriousConsoleErrors = consoleErrors.filter(message =>
    !/favicon|third.party cookie|deprecated/i.test(message)
  );
  if (seriousConsoleErrors.length) throw new Error('Browser console errors:\\n' + seriousConsoleErrors.join('\\n'));

  console.log(JSON.stringify({
    result: 'PASS',
    canvasVisible,
    placeableBlockSlots: allCount,
    buildingFilterSlots: buildingCount,
    itemIconSlots: itemCount,
    blockTextureFailures: textureFailures.length,
    pageErrors: pageErrors.length,
    consoleErrors: seriousConsoleErrors.length,
  }, null, 2));
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
