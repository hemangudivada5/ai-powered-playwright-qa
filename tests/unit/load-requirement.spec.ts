import { resolve } from 'node:path';
import { test, expect } from '@playwright/test';
import { loadRequirement } from '../../src/validation/load-requirement';

test('loader should read and validate the login requirement', () => {
  const filePath = resolve(
    process.cwd(),
    'test-data/login-requirement.json'
  );

  const requirement = loadRequirement(filePath);

  expect(requirement.requirementId).toBe('AUTH-001');
  expect(requirement.feature).toBe('User Login');
  expect(requirement.acceptanceCriteria).toHaveLength(4);
});