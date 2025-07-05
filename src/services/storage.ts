import { Message } from '../types';

const STORAGE_KEY = 'chatgpt-lite-messages';

export const saveMessages = (messages: Message[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save messages:', error);
  }
};

export const loadMessages = (): Message[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load messages:', error);
    return [];
  }
};

export const clearMessages = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear messages:', error);
  }
};