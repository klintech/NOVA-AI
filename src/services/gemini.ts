// services/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminiPrompt } from '../constants/geminiPrompt';
import { Message } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateGeminiResponse = async (messages: Message[]) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const userPrompt = messages[messages.length - 1].content;

  const result = await model.generateContent(`${geminiPrompt}\n\nUser: ${userPrompt}`);
  const response = await result.response.text();

  return response;
};
