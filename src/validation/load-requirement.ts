import { readFileSync } from 'node:fs';
import {
  requirementSchema,
  type Requirement,
} from './requirement.schema';

export function loadRequirement(filePath: string): Requirement {
  // Step 1: Read the file.
  const fileContent = readFileSync(filePath, 'utf-8');

  // Step 2: Convert the JSON text into data.
  let requirementData: unknown;

  try {
    requirementData = JSON.parse(fileContent);
  } catch {
    throw new Error('The requirement file contains invalid JSON.');
  }

  // Step 3: Check the data against our schema.
  const result = requirementSchema.safeParse(requirementData);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => {
        return `${issue.path.join('.')}: ${issue.message}`;
      })
      .join('\n');

    throw new Error(
      `The requirement is invalid:\n${details}`
    );
  }

  // Step 4: Return the validated requirement.
  return result.data;
}