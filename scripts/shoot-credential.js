// Shoots the credential-check demo on needtalk.com/for-providers, signed out, light and dark.
// The demo runs on a fictional provider; no account is involved.
//
// Playwright comes from the Need to Talk repo, so run it from there:
//   cd ~/NeedtoTalk/apps/web && NODE_PATH=$(pwd)/../../node_modules node ~/justinar-rasheed.com/scripts/shoot-credential.js /tmp/cred
// Then convert card-{light,dark}.png to public/work/need-to-talk/credential-check-{light,dark}.jpg:
//   sips -s format jpeg -s formatOptions 85 /tmp/cred/card-light.png --out public/work/need-to-talk/credential-check-light.jpg
const path = require("path");
const { chromium } = require("@playwright/test");

const out = process.argv[2];

(async () => {
  const browser = await chromium.launch();
  for (const scheme of ["light", "dark"]) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 2,
      colorScheme: scheme,
    });
    // Need to Talk keeps its own theme setting (utils/storage.js), so set it rather than rely on the system.
    await context.addInitScript((theme) => {
      try {
        window.localStorage.setItem("N2T_theme", theme);
      } catch {}
    }, scheme);
    const page = await context.newPage();
    await page.goto("https://needtalk.com/for-providers", { waitUntil: "networkidle" });
    const heading = page.getByRole("heading", { name: "Credentials verified in seconds" });
    await heading.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 400);
    // The demo plays as a story; shoot its last beat, once the license is verified.
    await page.getByText("3 of 3 cleared").first().waitFor({ timeout: 60000 });
    await page.getByText("Verified", { exact: true }).first().waitFor({ timeout: 60000 });
    // The demo is the smallest element holding both cards: the form and the checklist.
    await page.evaluate(() => {
      const leaf = [...document.querySelectorAll("*")].find(
        (e) => e.childElementCount === 0 && e.textContent.trim() === "Credential check",
      );
      let node = leaf;
      while (node && !node.textContent.includes("License ID")) node = node.parentElement;
      node.setAttribute("data-shot", "credential-demo");
    });
    const card = page.locator('[data-shot="credential-demo"]');
    await card.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
    await page.waitForTimeout(1500);
    const box = await card.boundingBox();
    // A margin of the section's own ground around the cards, so their shadows survive.
    await page.screenshot({
      path: path.join(out, `card-${scheme}.png`),
      clip: { x: box.x - 32, y: box.y - 32, width: box.width + 64, height: box.height + 64 },
    });
    await context.close();
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
