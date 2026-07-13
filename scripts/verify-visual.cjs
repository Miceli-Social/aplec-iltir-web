const { spawn } = require("node:child_process");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const server = spawn(process.execPath, [nextBin, "dev", "-p", "3000"], {
  cwd: root,
  windowsHide: true,
  stdio: ["ignore", "pipe", "pipe"],
});

let serverLog = "";
server.stdout.on("data", (chunk) => {
  serverLog += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverLog += chunk.toString();
});

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch("http://127.0.0.1:3000");
      if (response.ok) return;
    } catch {}
    await sleep(500);
  }
  throw new Error(`El servidor no ha respost.\n${serverLog}`);
}

async function inspectPage(page, url, screenshotName) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto(url, { waitUntil: "networkidle" });
  const textLength = await page.locator("body").innerText().then((text) => text.trim().length);
  const overlay = await page.locator("[data-nextjs-dialog]").count();
  await page.screenshot({
    path: path.join(root, ".next", screenshotName),
    fullPage: true,
  });
  return {
    url,
    status: response?.status(),
    title: await page.title(),
    textLength,
    overlay,
    errors,
  };
}

(async () => {
  let browser;
  try {
    await waitForServer();
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const home = await inspectPage(desktop, "http://127.0.0.1:3000", "iltir-home-desktop.png");
    const visibleMunicipalities = await desktop
      .locator(".municipality-card h3")
      .allTextContents();
    const sectorialCount = await desktop.locator(".sectorial-grid .circle-link").count();
    const circle = await inspectPage(
      desktop,
      "http://127.0.0.1:3000/cercles/sectorial-cultura",
      "iltir-circle-desktop.png",
    );
    const agenda = await inspectPage(
      desktop,
      "http://127.0.0.1:3000/agenda",
      "iltir-agenda-desktop.png",
    );
    await desktop.getByRole("button", { name: "Navata" }).click();
    const filteredAgendaCount = await desktop.locator(".agenda-grid .event-card").count();
    await desktop.goto("http://127.0.0.1:3000/admin", { waitUntil: "networkidle" });
    await desktop.getByLabel("Contrasenya").fill(process.env.ADMIN_TEST_PASSWORD || "");
    await desktop.getByRole("button", { name: "Entrar" }).click();
    await desktop.waitForLoadState("networkidle");
    await sleep(500);
    const adminUrl = desktop.url();
    const adminError = await desktop.locator(".form-error").allTextContents();
    const adminToolsCount = await desktop.locator(".admin-tools > a").count();
    await desktop.screenshot({
      path: path.join(root, ".next", "iltir-admin-desktop.png"),
      fullPage: true,
    });
    let adminMutationTest = "skipped";
    if (process.env.ADMIN_MUTATION_TEST === "1") {
      const testTitle = `PROVA TEMPORAL ${Date.now()}`;
      await desktop.locator("#agenda-admin").scrollIntoViewIfNeeded();
      await desktop.locator('#agenda-admin input[name="title"]').fill(testTitle);
      await desktop.locator('#agenda-admin input[name="start"]').fill("2026-12-31T18:00");
      await desktop.locator('#agenda-admin input[name="location"]').fill("Prova automàtica");
      await desktop.locator('#agenda-admin select[name="circleSlug"]').selectOption("sectorial-energia");
      await desktop.locator('#agenda-admin button[type="submit"]').click();
      await desktop.waitForURL(/ok=event/, { timeout: 30000 });
      await desktop.waitForLoadState("networkidle");
      const createUrl = desktop.url();
      const createAlerts = await desktop.locator(".admin-alert").allTextContents();
      const created = await desktop.getByText(testTitle).count();
      await desktop.goto("http://127.0.0.1:3000/agenda", { waitUntil: "networkidle" });
      const publicVisible = await desktop.getByText(testTitle).count();
      await desktop.goto("http://127.0.0.1:3000/admin", { waitUntil: "networkidle" });
      const eventArticle = desktop.locator(".admin-current-list article").filter({ hasText: testTitle });
      await eventArticle.getByRole("button", { name: "Eliminar" }).click();
      await desktop.waitForURL(/ok=event-deleted/, { timeout: 30000 });
      await desktop.waitForLoadState("networkidle");
      const removed = (await desktop.getByText(testTitle).count()) === 0;
      adminMutationTest = {
        status: created && publicVisible && removed ? "passed" : "failed",
        created,
        publicVisible,
        removed,
        createUrl,
        createAlerts,
      };
    }
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const mobileHome = await inspectPage(
      mobile,
      "http://127.0.0.1:3000",
      "iltir-home-mobile.png",
    );
    console.log(JSON.stringify({ home, circle, agenda, mobileHome, visibleMunicipalities, sectorialCount, filteredAgendaCount, adminToolsCount, adminUrl, adminError, adminMutationTest }, null, 2));
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})().catch((error) => {
  console.error(error);
  server.kill();
  process.exitCode = 1;
});
