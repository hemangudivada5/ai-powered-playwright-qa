import type { Requirement } from '../validation/requirement.schema';

export function buildScenarioPrompt(
  requirement: Requirement
): string {
  const acceptanceCriteria = requirement.acceptanceCriteria
    .map((criterion, index) => `${index + 1}. ${criterion}`)
    .join('\n');

  return `
You are an experienced software QA engineer.

Analyze the software requirement below and propose useful test scenarios.

REQUIREMENT ID:
${requirement.requirementId}

FEATURE:
${requirement.feature}

USER STORY:
${requirement.userStory}

ACCEPTANCE CRITERIA:
${acceptanceCriteria}

INSTRUCTIONS:
1. Cover positive, negative, and boundary scenarios where applicable.
2. Use only behavior supported by the supplied requirement.
3. Do not invent application features or unsupported business rules.
4. Include clear testing steps and an expected result.
5. Assign a priority: high, medium, or low.
6. Return only a valid JSON array.
7. Each array item must contain exactly these fields:
   - scenarioId: string
   - requirementId: string
   - title: string
   - category: "positive", "negative", or "boundary"
   - steps: array of non-empty strings
   - expectedResult: string
   - priority: "high", "medium", or "low"

Do not include Markdown fences or additional commentary.
`;
}