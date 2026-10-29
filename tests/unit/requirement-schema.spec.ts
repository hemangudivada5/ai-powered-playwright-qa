import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test, expect } from '@playwright/test';
import { requirementSchema } from '../../src/validation/requirement.schema';

test('login requirement should match the expected schema', () => {
  const filePath = resolve(process.cwd(),'test-data/login-requirement.json');

  const fileContent = readFileSync(filePath, 'utf-8');

  const requirementData: unknown = JSON.parse(fileContent);

  const result = requirementSchema.safeParse(requirementData);

  if (!result.success) {
    throw new Error(
      `Requirement validation failed:\n${JSON.stringify(
        result.error.issues,
        null,
        2
      )}`
    );
  }

  expect(result.data.requirementId).toBe('AUTH-001');
  expect(result.data.acceptanceCriteria).toHaveLength(4);
});

test('requirement schema should reject an invalid ID type', () => {
  const invalidRequirement = {
    requirementId: 123,
    feature: 'User Login',
    userStory: 'A registered user wants to log in.',
    acceptanceCriteria: ['Valid credentials should allow login.'],
  };

  const result = requirementSchema.safeParse(invalidRequirement);

  expect(result.success).toBe(false);
});
test('requirement schema should reject a whitespace-only ID', () => {
  const requirement = {
    requirementId: '   ',
    feature: 'User Login',
    userStory: 'A registered user wants to log in.',
    acceptanceCriteria: [
      'Valid credentials should allow login.',
    ],
  };

  const result = requirementSchema.safeParse(requirement);

  expect(result.success).toBe(false);
});