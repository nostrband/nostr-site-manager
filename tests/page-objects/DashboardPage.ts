import { Page, Locator } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly title: Locator;
  readonly mySitesButton: Locator;
  readonly loading: Locator;
  readonly titleStartPage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mySitesButton = page.getByText("My sites");
    this.title = page.getByText("Your sites");
    this.titleStartPage = page.getByText("Start by creating your first site");
    this.loading = page.locator('.MuiCircularProgress-root');
  }

  async navigate() {
    await this.page.goto("http://localhost:3000");
  }
}
