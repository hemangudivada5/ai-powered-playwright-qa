import { test, expect } from '@playwright/test';

test('should return mocked product data', async ({ page }) => {
  // Step 1: Intercept the product API request.
  await page.route('**/api/products', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Laptop', price: 1200 },
        { id: 2, name: 'Headphones', price: 100 },
      ]),
    });
  });

  // Step 2: Open the application.
  await page.goto('/');

  // Step 3: Request product data from the browser.
  const products = await page.evaluate(async () => {
    const response = await fetch('/api/products');
    return response.json();
  });

  // Step 4: Verify the response.
  expect(products).toHaveLength(2);
  expect(products[0].name).toBe('Laptop');
  expect(products[1].name).toBe('Headphones');
});
test('should receive a mocked server error', async ({ page }) => {
  // Step 1: Mock the API to return an HTTP 500 error.
  await page.route('**/api/products', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Internal Server Error',
      }),
    });
  });

  // Step 2: Open the application.
  await page.goto('/');

  // Step 3: Make the browser request.
  const result = await page.evaluate(async () => {
    const response = await fetch('/api/products');
    const body = await response.json();

    return {
      status: response.status,
      body,
    };
  });

  // Step 4: Verify the error response.
  expect(result.status).toBe(500);
  expect(result.body.error).toBe('Internal Server Error');
});