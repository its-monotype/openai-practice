export type ResponseError = {
  response: {
    status: number;
    data: any;
  };
};

export type ErrorWithMessage = {
  message: string;
};
