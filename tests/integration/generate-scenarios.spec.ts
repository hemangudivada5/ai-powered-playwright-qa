import { resolve } from 'node:path';
import { test, expect } from '@playwright/test';

import { generateScenarios } from '../../src/ai/generate-scenarios';
import { MockAiProvider } from '../../src/ai/mock-ai-provider';

test('workflow should return validated scenarios from a requirement', async () => {
  // Step 1: Find the login requirement file.
  const filePath = resolve(
    process.cwd(),
    'test-data/login-requirement.json'
  );

  // Step 2: Create our mock AI provider.
  const provider = new MockAiProvider();

  // Step 3: Run the complete workflow.
  const scenarios = await generateScenarios(filePath, provider);

  // Step 4: Check the result.
  expect(scenarios).toHaveLength(1);

  expect(scenarios[0]?.scenarioId).toBe('TC-AUTH-001');
  expect(scenarios[0]?.requirementId).toBe('AUTH-001');

  expect(scenarios[0]?.title).toBe(
    'Login with valid credentials'
  );

  expect(scenarios[0]?.category).toBe('positive');
});
test('workflow should reject invalid JSON from the provider', async () => {
  const filePath = resolve(
    process.cwd(),
    'test-data/login-requirement.json'
  );

  const provider = {
    async generate(_prompt: string): Promise<string> {
      return 'This is not valid JSON';
    },
  };

  await expect(
    generateScenarios(filePath, provider)
  ).rejects.toThrow(
    'The provider returned invalid JSON.'
  );
});
test('workflow should reject valid JSON with an invalid scenario structure', async () => {
  const filePath = resolve(
    process.cwd(),
    'test-data/login-requirement.json'
  );

  const provider = {
    async generate(_prompt: string): Promise<string> {
      return JSON.stringify([
        {
          scenarioId: 'TC-1',
        },
      ]);
    },
  };

  await expect(
    generateScenarios(filePath, provider)
  ).rejects.toThrow(
    'Generated scenarios are invalid:'
  );
});
test('workflow should reject an empty scenario list', async () => {
  const filePath = resolve(
    process.cwd(),
    'test-data/login-requirement.json'
  );

  const provider = {
    async generate(_prompt: string): Promise<string> {
      return JSON.stringify([]);
    },
  };

  await expect(
    generateScenarios(filePath, provider)
  ).rejects.toThrow(
    'Generated scenarios are invalid:'
  );
});
test('workflow should report a clear error when provider fails', async () => {
  const filePath = resolve(
    process.cwd(),
    'test-data/login-requirement.json'
  );

  const provider = {
    async generate(_prompt: string): Promise<string> {
      throw new Error('Connection timed out');
    },
  };

  await expect(
    generateScenarios(filePath, provider)
  ).rejects.toThrow(
    'AI provider request failed: Connection timed out'
  );
});