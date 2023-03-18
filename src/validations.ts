import { z } from 'zod';

export const quizSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(
    z.object({
      question: z.string(),
      answers: z.array(
        z.object({
          answer: z.string(),
          correct: z.boolean(),
        })
      ),
    })
  ),
});
