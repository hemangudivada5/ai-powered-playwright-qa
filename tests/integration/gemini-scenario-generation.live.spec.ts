
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test, expect } from '@playwright/test';
import { GeminiAiProvider } from '../../src/ai/gemini-ai-provider.js';
import { generateScenarios } from '../../src/ai/generate-scenarios.js';
import { saveScenariosToFile } from '../../src/ai/save-scenarios.js';

test.setTimeout(90_000);

test('Gemini generates, validates, and saves test scenarios', async () => {
  test.skip(
    process.env.RUN_GEMINI_LIVE_TEST !== 'true',
    'Set RUN_GEMINI_LIVE_TEST=true to enable this live API test.',
  );

  const requirementPath = resolve(
    process.cwd(),
    'test-data/login-requirement.json',
  );

  const outputPath = resolve(
    process.cwd(),
    'artifacts/generated-scenarios.json',
  );

  const provider = new GeminiAiProvider();

  // Generate scenarios using the real Gemini provider.
  const scenarios = await generateScenarios(
    requirementPath,
    provider,
  );

  // Save the validated scenarios to a JSON file.
  await saveScenariosToFile(outputPath, scenarios);

  // Read the saved file and verify its contents.
  const savedContent = await readFile(outputPath, 'utf8');
  const savedScenarios: unknown = JSON.parse(savedContent);

  expect(savedScenarios).toEqual(scenarios);
  expect(scenarios.length).toBeGreaterThan(0);

  expect(
    scenarios.every(
      (scenario) => scenario.requirementId === 'AUTH-001',
    ),
  ).toBe(true);

  console.log('Saved scenarios to:', outputPath);
  console.log('Validated scenarios:', JSON.stringify(scenarios, null, 2));
});
