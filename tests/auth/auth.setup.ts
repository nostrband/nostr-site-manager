import { test as setup, expect } from '@playwright/test';
import { LandingPage } from '../page-objects/LandingPage';
import path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('Register user and save credentials to the storage', async ({ page }) => {
  const landingPage = new LandingPage(page);
  await landingPage.navigate();
  await landingPage.clickLoginButton();
  // Locators. Should be moved to loginWidget page object
  const signUpButton = page.getByRole('button', { name: 'Sign up' });
  const createKeysButton = page.getByRole('button', { name: 'Create keys' });
  const nicknameInput = page.locator('input[placeholder="Enter username"]');
  const createProfileButton = page.getByText('Create profile');
  ///
  await expect(signUpButton).toBeVisible();
  await signUpButton.click();
  await createKeysButton.click();
  await nicknameInput.fill('0000-autotest-user'); 
  await createProfileButton.click();
  await expect(landingPage.mySitesButton).toBeVisible();

  await page.context().storageState({ path: authFile });
});