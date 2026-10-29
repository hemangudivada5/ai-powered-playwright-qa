export interface AiProvider {
  generate(prompt: string): Promise<string>;
}

export class MockAiProvider implements AiProvider {
  async generate(prompt: string): Promise<string> {
    if (prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty.');
    }

    const mockResponse = [
      {
        scenarioId: 'TC-AUTH-001',
        requirementId: 'AUTH-001',
        title: 'Login with valid credentials',
        category: 'positive',
        steps: [
          'Open the login page',
          'Enter valid username and password',
          'Click the Login button',
        ],
        expectedResult: 'The user logs in successfully.',
        priority: 'high',
      },
    ];

    return JSON.stringify(mockResponse);
  }
}