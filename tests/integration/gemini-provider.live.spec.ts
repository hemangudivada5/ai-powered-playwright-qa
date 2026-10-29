
import { test, expect } from '@playwright/test';
import { GeminiAiProvider } from '../../src/ai/gemini-ai-provider.js';
test.setTimeout(90_000);
test('Gemini provider returns a real model response', async () => {
  test.skip(
    process.env.RUN_GEMINI_LIVE_TEST !== 'true',
    'Set RUN_GEMINI_LIVE_TEST=true to enable this live API test.',
  );

  const provider = new GeminiAiProvider();

  const response = await provider.generate(
    'Return only a JSON object with one property: ' +
    '{"status":"GEMINI_PROVIDER_OK"}',
  );

  const result: unknown = JSON.parse(response);

  expect(result).toEqual({
    status: 'GEMINI_PROVIDER_OK',
  });
});
