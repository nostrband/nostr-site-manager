import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('register user', async ({ page }) => {
  await page.goto('https://localhost:3000');
});