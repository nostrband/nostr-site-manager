import { Page, Locator } from "@playwright/test";

export const SEARCH_SITE_NAME = "Leafes";
export const SEARCH_SITE_URL = "https://carlbmenger-leafes.npub.pro/";

export class DiscoverSitesPage {
  readonly page: Page;
  readonly emptyBlock: Locator;
  readonly resultSiteUrl: Locator;
  readonly brokenImage: Locator;
  readonly npub: Locator;

  
  constructor(page: Page) {
    this.page = page;
    this.emptyBlock = page.getByText("Sites not found");
    this.npub = page.getByText("npub1uu6...");
    this.brokenImage = page.locator('svg[data-testid="BrokenBigIconIcon"]');
    this.resultSiteUrl = page.getByText(SEARCH_SITE_URL);
  }

  async navigate() {
    await this.page.goto("http://localhost:3000/sites");
  }
}
