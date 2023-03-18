import { isQuiz, Quiz } from './types';

export const extractQuizFromString = (text: string): Quiz | null => {
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
