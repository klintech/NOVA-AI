import React from 'react';

interface Props {
  history: string[];
  onSelect: (message: string) => void;
  onClear: () => void;
}

const SearchHistory: React.FC<Props> = ({ history, onSelect, onClear }) => {
  return (
    <div className="bg-white p-4 shadow rounded-md border h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-700">Search History</h3>
        <button
          onClick={onClear}
          className="text-xs text-red-500 hover:underline"
        >
          Clear
        </button>
      </div>

      <ul className="space-y-2">
        {history.length === 0 ? (
          <li className="text-sm text-gray-400">No history yet.</li>
        ) : (
          history.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => onSelect(item)}
                className="text-blue-600 text-sm hover:underline text-left w-full"
              >
                {item.length > 60 ? item.slice(0, 60) + '...' : item}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SearchHistory;
