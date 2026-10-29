# AI-Powered Playwright QA Framework

## Project Overview

This project explores how AI can help QA engineers convert software requirements into structured test scenarios.

It integrates Google's Gemini API with Playwright, TypeScript, and Zod to generate candidate test scenarios, validate AI responses, and save validated scenarios as JSON.

The framework focuses on reducing repetitive QA work while keeping the QA engineer responsible for reviewing and approving generated scenarios.

## Project Objectives

- Convert software requirements into candidate test scenarios.
- Generate scenarios using a real AI model.
- Validate AI-generated output against predefined schemas.
- Handle invalid JSON, malformed scenarios, empty responses, and provider failures.
- Save validated scenarios for further QA review.
- Build a foundation for future AI-assisted test automation.

## Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Browser automation:** Playwright
- **AI integration:** Google Gemini API
- **AI SDK:** `@google/genai`
- **Schema validation:** Zod
- **Testing:** Playwright Test
- **Target application:** SauceDemo

## Architecture and Workflow

The current requirement-to-scenario workflow follows these steps:

1. Load a software requirement from a JSON file.
2. Validate the requirement using Zod.
3. Build a structured prompt from the requirement.
4. Send the prompt to the configured AI provider.
5. Receive the generated response.
6. Parse the response as JSON.
7. Validate the scenarios using the test-scenario schema.
8. Reject invalid output with descriptive errors.
9. Save validated scenarios to a JSON file.
10. Review the generated scenarios before using them in further testing.

The AI provider interface allows the framework to use either a mock provider for deterministic tests or the real Gemini provider.

## Project Structure

```text
ai-powered-playwright-qa/
├── src/
│   ├── ai/
│   │   ├── mock-ai-provider.ts
│   │   ├── gemini-ai-provider.ts
│   │   ├── scenario-prompt.ts
│   │   ├── generate-scenarios.ts
│   │   └── save-scenarios.ts
│   └── validation/
│       ├── requirement.schema.ts
│       ├── test-scenario.schema.ts
│       └── load-requirement.ts
├── test-data/
│   └── login-requirement.json
├── tests/
│   ├── integration/
│   │   ├── generate-scenarios.spec.ts
│   │   ├── gemini-provider.live.spec.ts
│   │   └── gemini-scenario-generation.live.spec.ts
│   ├── unit/
│   ├── ui/
│   └── smoke.spec.ts
├── artifacts/
│   └── generated-scenarios.json
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## AI Integration

The real Gemini provider implements the existing `AiProvider` interface.

The integration uses the `gemini-3.5-flash-lite` model and reads its API key from the `GEMINI_API_KEY` environment variable.

The scenario-generation workflow uses the AI response only after JSON parsing and schema validation. The mock provider remains available for deterministic unit and integration testing.

## Generated Test Scenario Structure

Each validated scenario contains the following fields:

- `scenarioId`
- `requirementId`
- `title`
- `category`
- `steps`
- `expectedResult`
- `priority`

The scenario schema validates the generated structure and restricts the supported category and priority values.

## Generated Output

Validated scenarios are saved to:

```text
artifacts/generated-scenarios.json
```

The live scenario-generation test also reads the saved file back and verifies that its contents match the validated scenarios.

The generated JSON is intended for QA review and further processing.

## Prerequisites

- Node.js and npm
- Git
- A Google account
- Gemini API access
- A supported Playwright browser installation

## Installation

Clone the repository and navigate to the project directory:

```bash
git clone <your-repository-url>
cd ai-powered-playwright-qa
npm install
```

Install the Playwright browser if it is not already installed:

```bash
npx playwright install chromium
```

## Configure the Gemini API Key

Create an API key through [Google AI Studio](https://aistudio.google.com/).

Configure it as a user environment variable on Windows:

```text
Variable name: GEMINI_API_KEY
Variable value: Your Gemini API key
```

Restart your terminal after configuring the variable.

Verify that the variable is available without displaying the key:

```powershell
if ($env:GEMINI_API_KEY) {
    Write-Output "GEMINI_API_KEY is set"
} else {
    Write-Output "GEMINI_API_KEY is not set"
}
```

Never commit API keys to source control or paste them into application logs.

## Running the Tests

### TypeScript Type Checking

```bash
npm run typecheck
```

### Full Test Suite

```bash
npm test
```

The live Gemini tests are skipped unless explicitly enabled. This keeps the regular test suite from making unnecessary external API calls.

### Smoke Test

```bash
npm run test:smoke
```

### Live Gemini Provider Test

In PowerShell:

```powershell
$env:RUN_GEMINI_LIVE_TEST = "true"
npx playwright test tests/integration/gemini-provider.live.spec.ts
```

This test sends a real request to Gemini and verifies the response.

### Live Scenario-Generation Test

```powershell
$env:RUN_GEMINI_LIVE_TEST = "true"
npx playwright test tests/integration/gemini-scenario-generation.live.spec.ts
```

This test generates scenarios from the login requirement, validates them, saves them, and verifies the saved output.

Live tests require a valid API key, available model capacity, and network access. They may incur API usage and can fail temporarily if the service is unavailable.

### HTML Test Report

```bash
npm run test:report
```

## Current Implementation Status

The following functionality has been implemented and verified:

- Playwright and TypeScript configuration.
- Initial SauceDemo smoke test.
- Requirement loading and schema validation.
- Structured scenario prompt generation.
- Mock AI provider for deterministic testing.
- Real Gemini provider integration.
- JSON parsing and Zod validation of generated scenarios.
- Error handling for provider failures and invalid output.
- Saving validated scenarios to JSON.
- Live Gemini provider test.
- Live requirement-to-scenario generation and file-saving test.

The full regular test suite most recently completed with **17 passed, 2 skipped, and 0 failed**. The two live tests were run separately and passed. TypeScript type checking also completed without errors.

## Safety and Quality Principles

- AI-generated scenarios must be reviewed by a QA engineer.
- Generated code must not execute automatically without approval.
- API keys must remain outside source control.
- Confidential requirements and sensitive production data must not be sent to external AI services without appropriate authorization.
- AI responses must be validated rather than blindly trusted.
- Invalid AI output and provider failures must be handled explicitly.
- Generated scenarios should be checked for coverage, relevance, and unsupported assumptions.

## Future Enhancements

- Add retry logic with bounded exponential backoff for transient provider errors.
- Add broader edge-case and boundary-scenario coverage.
- Improve generated scenario quality and requirement traceability.
- Introduce a human-review and approval workflow.
- Generate Playwright test drafts from approved scenarios.
- Execute approved tests and analyze sanitized failure information.
- Extend AI evaluation for consistency, factuality, and prompt adherence.

## Project Goal

Build a practical AI-assisted QA framework that combines traditional test automation, structured validation, and controlled AI usage to make software testing more efficient and reliable.
