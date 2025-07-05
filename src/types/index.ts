export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isLoading?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface VoiceState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
}