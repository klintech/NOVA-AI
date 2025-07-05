import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const filteredMessages = messages.filter((msg) => !msg.isLoading);

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
              <p className="text-gray-600 mb-4">
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
        filteredMessages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))
      )}

      {/* Single clean typing animation */}
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
