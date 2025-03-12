import { Page, Locator } from "@playwright/test";

export class LandingPage {
  readonly page: Page;
  readonly mySitesButton: Locator;
  readonly loginButton: Locator;
  readonly getStartedButton: Locator;
  readonly themesSection: Locator;
  readonly themeElementImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mySitesButton = page.getByText("My sites");
    this.loginButton = page.getByText("Login");
    this.getStartedButton = page.getByText("Get started");
    this.themesSection = page.locator("#themes-onboarding");
    this.themeElementImage = page.locator('img[alt="London"]');
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async navigate() {
    await this.page.goto("http://localhost:3000");
  }

  async scrollToThemesSection() {
    await this.themesSection.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
  }

  async hoverThemeElementImage() {
    const parentElement = this.themeElementImage.locator("..");
    await parentElement.hover();
  }
}
