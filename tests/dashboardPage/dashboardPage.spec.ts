import { test, expect } from "@playwright/test";
import { DashboardPage } from "../page-objects/DashboardPage";
import path from "path";

const userFile = path.join(__dirname, "../../playwright/.auth/user-01.json");

test.describe("Dashboard Page Tests without storageState", () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test("User has no created sites", async ({ page }) => {
    await dashboardPage.mySitesButton.click();
    await expect(dashboardPage.titleStartPage).toBeVisible();

    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot).toMatchSnapshot("dashboard-start-page.png");
  });
});

test.describe("Dashboard Page Tests", () => {
  let dashboardPage: DashboardPage;

  test.use({ storageState: userFile });

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test("User have some sites", async ({ page }) => {
    await dashboardPage.mySitesButton.click();
    await expect(dashboardPage.title).toBeVisible();

    await expect(dashboardPage.loading).not.toBeAttached();

    await page.waitForLoadState("networkidle");

    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot).toMatchSnapshot("dashboard-page.png");
  });
});
