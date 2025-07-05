import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Square } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoiceInput';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput();

  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 pb-4 pt-3 bg-white/70 backdrop-blur-md border-t border-gray-200 shadow-2xl">
      <form onSubmit={handleSubmit} className="flex items-end space-x-4 max-w-6xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask NOVA anything..."
            className="w-full px-4 py-3 pr-12 text-base border border-gray-300 rounded-xl resize-none bg-white/80 shadow-inner max-h-36 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            rows={1}
            disabled={isLoading}
          />
          {isSupported && (
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`absolute right-3 top-3 p-1 rounded-full ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-purple-500 hover:text-purple-700'
              } transition duration-200`}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {isLoading ? <Square className="w-5 h-5" /> : <Send className="w-5 h-5" />}
        </button>
      </form>

      {isListening && (
        <div className="mt-2 flex items-center text-sm text-red-500 space-x-2 max-w-6xl mx-auto">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span>Listening...</span>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500 text-center max-w-6xl mx-auto">
        NOVA AI can make mistakes.{' '}
        <a
          href="https://ai.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-purple-500 hover:text-purple-700"
        >
          Learn more
        </a>
        .
      </div>
    </div>
  );
};

export default MessageInput;
