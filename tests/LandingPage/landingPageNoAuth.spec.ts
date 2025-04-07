import { test, expect } from "@playwright/test";
import { LandingPage } from "../page-objects/LandingPage";

test.describe("Landing Page Tests without auth user", () => {
  let landingPage: LandingPage;
  
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await landingPage.navigate();
  });

  test("Full page screenshot when no auth user", async ({ page }) => {
    await expect(landingPage.loginButton).toBeVisible();
    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot).toMatchSnapshot("full-page-landing-no-auth-user.png");
  });
});
