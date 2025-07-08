import React, { useState, useEffect } from 'react';
import { Message, ChatState } from './types';
import { generateGeminiResponse as generateResponse } from './services/gemini';
import {
  saveMessages,
  loadMessages,
  clearMessages,
  saveToHistory,
  loadHistory
} from './services/storage';

import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import SearchHistory from './components/SearchHistory';

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const [history, setHistory] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      console.error("Gemini API Error:", error);
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while fetching AI response.'
      }));
    }
  };

  const handleClearChat = () => {
    setChatState({ messages: [], isLoading: false, error: null });
    clearMessages();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <div className="w-full max-w-screen-2xl mx-auto flex flex-col flex-1 overflow-hidden px-0 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between py-2 px-4 sm:px-0">
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle search history sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Header
            messageCount={chatState.messages.filter(m => !m.isLoading).length}
            onClearChat={handleClearChat}
          />

          <div className="w-8 lg:w-0" />
        </div>

        {/* Body */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto gap-4 relative">
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <aside
            className={`fixed z-40 top-0 left-0 h-full w-64 bg-white shadow-lg border-r transition-transform duration-200
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:static lg:translate-x-0 lg:w-1/4 lg:shadow-none lg:border-none
            `}
            style={{ minHeight: '100vh' }}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-2 lg:hidden">
                <span className="font-semibold text-gray-700 text-base">Search History</span>
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-700 hover:bg-gray-200"
                  onClick={() => setSidebarOpen(false)}
                  title="Close sidebar"
                  aria-label="Close sidebar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <SearchHistory
                history={history}
                onSelect={(msg) => {
                  handleSendMessage(msg);
                  setSidebarOpen(false);
                }}
                onClear={handleClearChat}
                minimized={true}
              />
            </div>
          </aside>

          {/* Chat Area */}
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
