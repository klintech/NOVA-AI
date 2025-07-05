import React from 'react';
import { MessageSquare, Trash2, Settings } from 'lucide-react';

interface HeaderProps {
  onClearChat: () => void;
  messageCount: number;
}

const Header: React.FC<HeaderProps> = ({ onClearChat, messageCount }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-800">NOVA AI</h1>
          <p className="text-xs text-gray-500">
            {messageCount > 0 ? `${messageCount} messages` : 'No messages yet'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onClearChat}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          disabled={messageCount === 0}
          title="Clear chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        
        <button
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;