import { Configuration, OpenAIApi } from 'openai';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env['API_KEY'],
});

const openai = new OpenAIApi(configuration);

export type ResponseError = {
  response: {
    status: number;
    data: any;
  };
};

export type ErrorWithMessage = {
  message: string;
};

export const isResponseError = (error: any): error is ResponseError => {
  return error.response !== undefined;
};

export const isErrorWithMessage = (error: any): error is ErrorWithMessage => {
  return error.message !== undefined;
};

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

type Quiz = z.infer<typeof quizSchema>;

export const isQuiz = (quiz: any): quiz is Quiz =>
  quizSchema.safeParse(quiz).success;

const extractQuizFromString = (text: string): Quiz | null => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  const objectString = text.slice(start, end + 1);

  try {
    const parsedObject = JSON.parse(objectString);

    if (!isQuiz(parsedObject)) return null;

    return parsedObject;
  } catch (err) {
    console.error('Error parsing JSON', err);
    return null;
  }
};

const parseInto: Quiz = {
  title: '',
  description: '',
  questions: [
    {
      question: '',
      answers: [
        {
          answer: '',
          correct: true,
        },
        {
          answer: '',
          correct: false,
        },
      ],
    },
  ],
};

const amountOfQuestions = 5;

const isMultiChoice = true;

const quizType = isMultiChoice ? 'multiple-choice' : 'single-choice';

const textToParse = `React.js (or simply React) is a JavaScript library for creating user interfaces (UIs). It was developed by Facebook and released in 2013. React is based on the idea of separating the user interface into individual components that can be reused and put together to create more complex applications. React uses the JSX (JavaScript Language Extension) syntax, which allows developers to use an HTML-like syntax to describe components and how they interact with each other. React also uses a virtual DOM (Document Object Model), which allows it to efficiently update only the necessary parts of the page, minimizing the number of DOM operations. This makes React faster and more performant than other UI libraries. React also allows you to use many third-party libraries and tools, making it very flexible and suitable for a variety of projects.`;

const sysContent = `You need to generate a quiz based on the following text. The quiz should consist of ${amountOfQuestions} ${quizType} questions. You can use any relevant information from the text to generate the questions, but avoid questions that are too similar or too easy.`;

const userContent = `Parse the following text into a quiz with ${amountOfQuestions} ${quizType} questions. Use the following JSON format: ${JSON.stringify(
  parseInto
)}.\n\nTEXT TO PARSE: ${textToParse}`;

(async () => {
  try {
    const completionRes = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: sysContent },
        { role: 'user', content: userContent },
      ],
    });

    const completion = completionRes.data.choices[0].message;

    if (completion === undefined) throw new Error('No completion found');

    const quiz = extractQuizFromString(completion.content);

    if (quiz === null) throw new Error('Failed to parse quiz');

    console.log('🎉 Quiz:', JSON.stringify(quiz, null, 2));
  } catch (err) {
    if (isResponseError(err)) {
      console.log(err.response.status);
      console.log(err.response.data);
    } else if (isErrorWithMessage(err)) {
      console.log(err.message);
    } else {
      console.error(err);
    }
  }
})();
