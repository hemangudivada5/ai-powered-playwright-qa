
import { GoogleGenAI, ThinkingLevel } from '@google/genai';import type { AiProvider } from './mock-ai-provider.js';

export class GeminiAiProvider implements AiProvider {
  private readonly client: GoogleGenAI;

  constructor(
    apiKey: string | undefined = process.env.GEMINI_API_KEY,
  ) {
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY environment variable is not set.',
      );
    }

    this.client = new GoogleGenAI({ apiKey });
  }

  async generate(prompt: string): Promise<string> {
    if (prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty.');
    }

    const response = await this.client.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
  temperature: 0.2,
  responseMimeType: 'application/json',
},
    });

    const generatedText = response.text;

    if (!generatedText) {
      throw new Error('Gemini returned an empty response.');
    }

    return generatedText;
  }
}
