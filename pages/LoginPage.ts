import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');

    this.loginButton = page.getByRole('button', {
      name: 'Login',
    });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }
}