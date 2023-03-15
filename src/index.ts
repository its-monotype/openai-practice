import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import { isErrorWithMessage, isResponseError } from './utils';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env['API_KEY'],
});

const openai = new OpenAIApi(configuration);

// TODO: Implement this function, now it not working correctly
const extractObjectFromString = (text: string) => {
  // const regex = /{[^{}]*}/;
  // const match = regex.exec(text);
  // if (!match) {
  //   throw new Error('No object found in the text');
  // }
  // return JSON.parse(match[0]);
};

const parseInto = {
  quiz: {
    title: 'Title of the quiz',
    description: 'Description of the quiz',
    questions: [
      {
        question: 'Question 1',
        answers: [
          {
            answer: 'Answer 1',
            correct: true,
          },
          {
            answer: 'Answer 2',
            correct: false,
          },
          {
            answer: 'Answer 3',
            correct: false,
          },
        ],
      },
    ],
  },
};

const textToParse =
  'React.js (or simply React) is a JavaScript library for creating user interfaces (UIs). It was developed by Facebook and released in 2013. React is based on the idea of separating the user interface into individual components that can be reused and put together to create more complex applications. React uses the JSX (JavaScript Language Extension) syntax, which allows developers to use an HTML-like syntax to describe components and how they interact with each other. React also uses a virtual DOM (Document Object Model), which allows it to efficiently update only the necessary parts of the page, minimizing the number of DOM operations. This makes React faster and more performant than other UI libraries. React also allows you to use many third-party libraries and tools, making it very flexible and suitable for a variety of projects.';

const sysContent =
  'You are given a text and asked to parse it into a quiz witch will used by a student to learn that topic. Parse the text into a quiz, try hard to make it as accurate as possible.';

const userContent = `Parse the following text into a quiz using the following JSON format: ${JSON.stringify(
  parseInto
)}. \n\nTEXT TO PARSE: ${textToParse}`;

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

    if (completion === undefined) {
      throw new Error('No completion found');
    }

    console.log(completion.content);
  } catch (error) {
    if (isResponseError(error)) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else if (isErrorWithMessage(error)) {
      console.log(error.message);
    } else {
      console.error(error);
    }
  }
})();
