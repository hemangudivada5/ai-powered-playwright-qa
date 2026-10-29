import { test, expect } from '@playwright/test';
import { testScenarioSchema } from '../../src/validation/test-scenario.schema';

test('schema should accept a valid test scenario', () => {
  const scenario = {
    scenarioId: 'TC-001',
    requirementId: 'AUTH-001',
    title: 'Login with valid credentials',
    category: 'positive',
    steps: [
      'Open the login page',
      'Enter valid username and password',
      'Click the Login button',
    ],
    expectedResult: 'The user should log in successfully',
    priority: 'high',
  };

  const result = testScenarioSchema.safeParse(scenario);

  expect(result.success).toBe(true);
});

test('schema should reject an invalid priority', () => {
  const scenario = {
    scenarioId: 'TC-002',
    requirementId: 'AUTH-001',
    title: 'Login with an incorrect password',
    category: 'negative',
    steps: ['Enter an incorrect password'],
    expectedResult: 'The login should be rejected',
    priority: 'urgent',
  };

  const result = testScenarioSchema.safeParse(scenario);

  expect(result.success).toBe(false);
});