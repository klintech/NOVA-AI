import React, { useState, useEffect } from 'react';
import { Message, ChatState } from './types';
import { generateGeminiResponse as generateResponse } from "./services/gemini";
import {
  saveMessages,
  loadMessages,
  clearMessages,
  saveToHistory,
  loadHistory,
  clearHistory
} from './services/storage';
import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import SearchHistory from './components/SearchHistory';

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null
  });

  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const savedMessages = loadMessages();
    const savedHistory = loadHistory();
    setChatState(prev => ({ ...prev, messages: savedMessages }));
    setHistory(savedHistory);
  }, []);

  useEffect(() => {
    if (chatState.messages.length > 0) {
      saveMessages(chatState.messages);
    }
  }, [chatState.messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    saveToHistory(content);
    setHistory(loadHistory());

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    const newMessages = chatState.messages
      .filter(msg => !msg.isLoading)
      .concat(userMessage);

    setChatState(prev => ({
      ...prev,
      messages: [...newMessages],
      isLoading: true,
      error: null
    }));

    try {
      const response = await generateResponse([...newMessages]);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false
      }));
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred.'
      }));
    }
  };

  const handleClearChat = () => {
    setChatState({ messages: [], isLoading: false, error: null });
    clearMessages();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="w-full max-w-screen-2xl mx-auto flex flex-col flex-1 overflow-hidden px-4 sm:px-6 lg:px-8">
        <Header
          onClearChat={handleClearChat}
          messageCount={chatState.messages.filter(m => !m.isLoading).length}
        />

        <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto gap-4">
          <aside className="w-full lg:w-1/4">
            <SearchHistory
              history={history}
              onSelect={handleSendMessage}
              onClear={() => {
                clearHistory();
                setHistory([]);
              }}
            />
          </aside>

          <section className="flex-1 flex flex-col">
            <MessageList
              messages={chatState.messages}
              isLoading={chatState.isLoading}
              onSendMessage={handleSendMessage}
            />

            {chatState.error && (
              <div className="my-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-800 text-sm">
                  <strong>Error:</strong> {chatState.error}
                </div>
              </div>
            )}

            <MessageInput
              onSendMessage={handleSendMessage}
              isLoading={chatState.isLoading}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
