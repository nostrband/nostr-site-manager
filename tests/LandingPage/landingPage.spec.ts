import { test, expect } from "@playwright/test";
import { LandingPage } from "../page-objects/LandingPage";

test.describe("Landing Page Tests", () => {
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await landingPage.navigate();
  });

  test("Full page", async ({ page }) => {
    await expect(landingPage.mySitesButton).toBeVisible();
    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot).toMatchSnapshot("landing-page.png");
  });

  test("Full page scroll and view sticky header", async ({ page }) => {
    await page.evaluate(() => window.scrollBy(0, 500));
    await expect(landingPage.getStartedButton).toBeVisible();
    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot).toMatchSnapshot("landing-page-scroll.png");
  });

  test("Scroll to themes section & hover theme", async ({ page }) => {
    await landingPage.scrollToThemesSection();
    await landingPage.hoverThemeElementImage();
    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot).toMatchSnapshot("landing-page-scroll-to-themes.png");
  });
});
