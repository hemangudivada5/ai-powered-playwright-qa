import { loadRequirement } from '../validation/load-requirement';
import {
  testScenarioSchema,
  type TestScenario,
} from '../validation/test-scenario.schema';
import { buildScenarioPrompt } from './scenario-prompt';
import type { AiProvider } from './mock-ai-provider';

export async function generateScenarios(
  filePath: string,
  provider: AiProvider
): Promise<TestScenario[]> {
  // Step 1: Read and validate the requirement.
  const requirement = loadRequirement(filePath);

  // Step 2: Prepare instructions for the AI provider.
  const prompt = buildScenarioPrompt(requirement);

  // Step 3: Ask the provider for its response.
let response: string;

try {
  response = await provider.generate(prompt);
} catch (error: unknown) {
  const message =
    error instanceof Error ? error.message : 'Unknown error';

  throw new Error(
    `AI provider request failed: ${message}`
  );
}
  // Step 4: Convert the response text into data.
  let responseData: unknown;

  try {
    responseData = JSON.parse(response);
  } catch {
    throw new Error('The provider returned invalid JSON.');
  }

  // Step 5: Validate the generated scenarios.
  const result = testScenarioSchema
  .array()
  .min(1, 'At least one test scenario is required')
  .safeParse(responseData);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(
      `Generated scenarios are invalid:\n${details}`
    );
  }

  // Step 6: Return only validated scenarios.
  return result.data;
}