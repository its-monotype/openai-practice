import { ErrorWithMessage, ResponseError } from './types';

export const isResponseError = (error: any): error is ResponseError => {
  return error.response !== undefined;
};

export const isErrorWithMessage = (error: any): error is ErrorWithMessage => {
  return error.message !== undefined;
};
