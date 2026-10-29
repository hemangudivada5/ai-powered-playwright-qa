import { z } from 'zod';

export const testScenarioSchema = z.object({
  scenarioId: z.string().trim().min(1),

  requirementId: z.string().trim().min(1),

  title: z.string().trim().min(1),

  category: z.enum([
    'positive',
    'negative',
    'boundary',
  ]),

  steps: z
    .array(z.string().trim().min(1))
    .min(1),

  expectedResult: z.string().trim().min(1),

  priority: z.enum([
    'high',
    'medium',
    'low',
  ]),
});

export type TestScenario = z.infer<typeof testScenarioSchema>;