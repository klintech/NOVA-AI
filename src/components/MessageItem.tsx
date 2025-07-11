import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { Clipboard, Check } from 'lucide-react';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div
      className={`flex w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-20 mb-4 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="mr-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-purple-200 flex items-center justify-center text-lg font-bold shadow-inner">
            🤖
          </div>
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`
          relative px-4 py-3 rounded-2xl shadow-md break-words whitespace-pre-wrap text-sm leading-relaxed
          ${isUser
            ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-br-md'
            : 'bg-white/90 text-gray-800 border border-gray-200 backdrop-blur-md rounded-bl-md'}
          max-w-[90%] sm:max-w-[80%] md:max-w-[700px]
        `}
      >
        {!isUser && (
          <div className="text-xs text-purple-600 font-semibold mb-1">AI</div>
        )}

        {/* Message Content */}
        <div className="whitespace-pre-wrap break-words">
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown
              className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap"
              components={{
                code({ node, inline, className, children, ...props }) {
                  return (
                    <code
                      className={`${
                        inline
                          ? 'bg-gray-200 text-purple-700 rounded px-1 py-0.5'
                          : 'block bg-gray-100 rounded p-3 overflow-x-auto text-sm'
                      } font-mono`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                pre({ node, children, ...props }) {
                  return (
                    <pre
                      className="bg-gray-100 p-3 rounded-lg overflow-x-auto text-sm"
                      {...props}
                    >
                      {children}
                    </pre>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Timestamp */}
        <div
          className={`mt-2 text-[11px] text-right ${
            isUser ? 'text-blue-100' : 'text-gray-400'
          }`}
        >
          {time}
        </div>

        {/* Copy Button */}
        {!isUser && (
          <button
            onClick={handleCopy}
            title="Copy response"
            className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100 transition"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500 animate-pulse" />
            ) : (
              <Clipboard className="w-4 h-4 text-gray-400" />
            )}
          </button>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="ml-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center text-lg font-bold shadow-inner">
            👻
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
