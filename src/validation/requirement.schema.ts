import { z } from 'zod';

export const requirementSchema = z.object({
  requirementId: z
    .string()
    .trim()
    .min(1, 'Requirement ID is required'),

  feature: z
    .string()
    .trim()
    .min(1, 'Feature is required'),

  userStory: z
    .string()
    .trim()
    .min(1, 'User story is required'),

  acceptanceCriteria: z
    .array(
      z.string()
        .trim()
        .min(1, 'Acceptance criterion cannot be empty')
    )
    .min(1, 'At least one acceptance criterion is required'),
});

export type Requirement = z.infer<typeof requirementSchema>;