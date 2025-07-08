import React from 'react';
import { Trash2, Settings2 } from 'lucide-react';

interface Props {
  history: string[];
  onSelect: (message: string) => void;
  onClear: () => void;
  minimized?: boolean;
}

const SearchHistory: React.FC<Props> = ({
  history,
  onSelect,
  onClear,
  minimized
}) => {
  return (
    <div
      className={`
        bg-white h-full flex flex-col border-r border-gray-200
        ${minimized ? 'p-1 text-xs' : 'p-2 text-sm'}
      `}
      style={{
        minWidth: minimized ? '80px' : '200px',
        maxWidth: minimized ? '120px' : '240px',
      }}
    >
      {/* History List */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {history.length === 0 ? (
          <p className="text-gray-400 px-2">No history yet.</p>
        ) : (
          history.map((item, index) => (
            <button
              key={index}
              onClick={() => onSelect(item)}
              title={item}
              className="block text-blue-600 hover:underline text-left w-full truncate px-2"
            >
              {item.length > 30 ? item.slice(0, 30) + '...' : item}
            </button>
          ))
        )}
      </div>

      {/* Sticky Footer Buttons */}
      <div className="border-t border-gray-100 pt-3 px-3 flex items-center justify-between">
        <button
          onClick={onClear}
          title="Clear Chat"
          className="text-red-500 hover:text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          title="Settings (coming soon)"
          disabled
          className="text-gray-400 hover:text-purple-600"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SearchHistory;
