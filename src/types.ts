import { z } from 'zod';
import { quizSchema } from './validations';

const isObject = (value: unknown): value is object => {
  return typeof value === 'object' && value !== null;
};

type ResponseError = {
  response: {
    status: number;
    data: any;
  };
};

export const isResponseError = (value: unknown): value is ResponseError => {
  return (
    isObject(value) &&
    'response' in value &&
    isObject(value.response) &&
    'status' in value.response &&
    typeof value.response.status === 'number' &&
    'data' in value.response
  );
};

type ErrorWithMessage = {
  message: string;
};

export const isErrorWithMessage = (
  value: unknown
): value is ErrorWithMessage => {
  return (
    isObject(value) && 'message' in value && typeof value.message === 'string'
  );
};

export type Quiz = z.infer<typeof quizSchema>;

export const isQuiz = (quiz: unknown): quiz is Quiz => {
  return quizSchema.safeParse(quiz).success;
};
