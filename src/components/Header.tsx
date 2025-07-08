import React from 'react';
import { MessageSquare } from 'lucide-react';

interface HeaderProps {
  onClearChat: () => void;
  messageCount: number;
}

const Header: React.FC<HeaderProps> = ({ messageCount }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-start">
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
    </header>
  );
};

export default Header;
