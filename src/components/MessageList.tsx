import React, { useEffect, useRef, useState } from 'react';
import { Message } from '../types';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const filteredMessages = messages.filter((msg) => !msg.isLoading);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSuggestions = (msg: string): string[] => [
    "Summarize this",
    "Give a simpler explanation",
    "Can you expand on this"
  ];

  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 bg-gradient-to-br from-blue-50 via-white to-purple-100 w-full h-full">
      {filteredMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-200 w-full max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="text-7xl mb-4 drop-shadow-lg">🤖</div>
              <h2 className="text-3xl font-bold mb-2 text-gray-800">
                Welcome to <span className="text-purple-600">NOVA Lite</span>
              </h2>
              <p className="text-gray-600 mb-4 text-center">
                Start a conversation by typing a message or using voice input — developed by{' '}
                <a
                  href="https://github.com/klintech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 underline font-semibold"
                >
                  KLINTECH
                </a>.
              </p>
              <div className="flex gap-2 mt-2">
                <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium shadow">
                  AI Chat
                </span>
                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium shadow">
                  Voice Input
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        filteredMessages.map((message, index) => (
          <div key={message.id} className="relative group">
            <MessageItem message={message} />

            {message.role === 'assistant' && (
              <>
                {/* Copy Button */}
                <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(message.id, message.content)}
                    className="hover:text-green-500"
                  >
                    {copiedId === message.id ? '✅ Copied!' : '📋 Copy'}
                  </button>
                </div>

                {/* Suggestions */}
                <div className="mt-1 space-y-1 flex flex-wrap gap-2">
                  {getSuggestions(message.content).map((suggestion, i) => (
                    <button
                      key={i}
                      className="text-blue-600 bg-blue-50 hover:bg-blue-100 transition text-xs px-2 py-1 rounded-full"
                      onClick={() => onSendMessage(`${suggestion}: "${message.content}"`)}
                    >
                      💡 {suggestion}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ))
      )}

      {/* Typing animation */}
      {isLoading && (
        <div className="flex items-end justify-start mb-3 animate-fade-in">
          <div className="max-w-[75%] px-4 py-3 rounded-2xl shadow bg-white/80 backdrop-blur-md border border-gray-200 text-gray-800 rounded-bl-md flex items-center gap-2">
            <span className="animate-bounce">🤖</span>
            <span className="italic text-purple-500">NOVA is typing…</span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
