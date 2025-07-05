import React, { useState, useEffect } from 'react';
import { Message, ChatState } from './types';
import { generateGeminiResponse as generateResponse } from "./services/gemini";
import { saveMessages, loadMessages, clearMessages } from './services/storage';
import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null
  });

  // Load messages from localStorage on first load
  useEffect(() => {
    const savedMessages = loadMessages();
    setChatState(prev => ({ ...prev, messages: savedMessages }));
  }, []);

  // Save messages whenever they update
  useEffect(() => {
    if (chatState.messages.length > 0) {
      saveMessages(chatState.messages);
    }
  }, [chatState.messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    const newMessages = chatState.messages
      .filter(msg => !msg.isLoading) // Ensure no existing "loading" message
      .concat(userMessage); // Add user's message

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

        <main className="flex-1 flex flex-col overflow-y-auto">
          <MessageList 
            messages={chatState.messages} 
            isLoading={chatState.isLoading} 
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
        </main>
      </div>
    </div>
  );
}

export default App;
