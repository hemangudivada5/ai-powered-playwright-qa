import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('homepage should load successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();

  await expect(page).toHaveTitle(/Swag Labs/);

  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.loginButton).toBeVisible();
});