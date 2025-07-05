import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminiPrompt } from '../constants/geminiPrompt';
import { Message } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateGeminiResponse = async (messages: Message[]) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // ✅ Get the latest user message
  const latestUserMessage = messages.filter(msg => msg.role === 'user').pop();

  if (!latestUserMessage) {
    throw new Error('No user message found to send to Gemini.');
  }

  // ✅ Construct the prompt from history (optional, or just use latest)
  const prompt = `${geminiPrompt}\n\nUser: ${latestUserMessage.content}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return response;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to get response from Gemini");
  }
};
