import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import { isErrorWithMessage, isResponseError, Quiz } from './types';
import { parseQuizFromText } from './utils';

dotenv.config();

const openaiConfig = new Configuration({
  apiKey: process.env['API_KEY'],
});

export const openai = new OpenAIApi(openaiConfig);

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

    const quiz = parseQuizFromText(completion.content);

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
