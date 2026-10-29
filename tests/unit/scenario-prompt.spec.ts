import { resolve } from 'node:path';
import { test, expect } from '@playwright/test';

import { loadRequirement } from '../../src/validation/load-requirement';
import { buildScenarioPrompt } from '../../src/ai/scenario-prompt';

test('prompt should contain the login requirement and instructions', () => {
  const filePath = resolve(
    process.cwd(),
    'test-data/login-requirement.json'
  );

  const requirement = loadRequirement(filePath);
  const prompt = buildScenarioPrompt(requirement);

  expect(prompt).toContain('AUTH-001');
  expect(prompt).toContain('User Login');

  expect(prompt).toContain(
    'A user with valid credentials can log in successfully.'
  );

  expect(prompt).toContain(
    'An incorrect password should prevent login.'
  );

  expect(prompt).toContain(
    'Return only a valid JSON array.'
  );
});