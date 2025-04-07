import { test, expect } from "@playwright/test";
import {
  DiscoverSitesPage,
  SEARCH_SITE_NAME,
} from "../page-objects/DiscoverSitesPage";

test.describe("Discover Page Tests", () => {
  let discoverSitesPage: DiscoverSitesPage;

  test.beforeEach(async ({ page }) => {
    discoverSitesPage = new DiscoverSitesPage(page);
    await discoverSitesPage.navigate();
  });

  test(`Search ${SEARCH_SITE_NAME} site`, async ({ page }) => {
    await page.waitForLoadState("networkidle");

    await page.fill('input[id="search-site"]', SEARCH_SITE_NAME);
    await page.waitForTimeout(1000);
    await page.waitForLoadState("networkidle");

    await expect(discoverSitesPage.resultSiteUrl).toBeVisible();
    await expect(discoverSitesPage.brokenImage).toBeVisible();
    await expect(discoverSitesPage.npub).not.toBeAttached();

    await page.waitForLoadState("networkidle");

    await page.waitForTimeout(2000);

    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot).toMatchSnapshot("discover-result-page.png");
  });

  test("Empty search result", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await page.fill('input[id="search-site"]', "42d345d5343d 5345r34rt2er");

    await page.waitForTimeout(1000);
    await page.waitForLoadState("networkidle");

    await expect(discoverSitesPage.emptyBlock).toBeVisible();

    await page.waitForLoadState("networkidle");

    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot).toMatchSnapshot("discover-empty-page.png");
  });
});
