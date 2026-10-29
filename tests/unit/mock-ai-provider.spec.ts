import { test, expect } from '@playwright/test';
import { MockAiProvider } from '../../src/ai/mock-ai-provider';
import { testScenarioSchema } from '../../src/validation/test-scenario.schema';

test('mock provider should return a valid test scenario', async () => {
  const provider = new MockAiProvider();

  const response = await provider.generate(
    'Generate test scenarios for login'
  );

  const scenarioData: unknown = JSON.parse(response);

  const result = testScenarioSchema
    .array()
    .safeParse(scenarioData);

  expect(result.success).toBe(true);

  if (result.success) {
    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.title).toBe(
      'Login with valid credentials'
    );
  }
});

test('mock provider should reject an empty prompt', async () => {
  const provider = new MockAiProvider();

  await expect(
    provider.generate('   ')
  ).rejects.toThrow('Prompt cannot be empty.');
});