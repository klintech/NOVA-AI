const HISTORY_KEY = 'chatgpt-lite-history';

export const saveToHistory = (message: string): void => {
  try {
    const existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const updated = [...new Set([message, ...existing])].slice(0, 20); // Keep unique + recent
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save to history:', err);
  }
};

export const loadHistory = (): string[] => {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (err) {
    console.error('Failed to load history:', err);
    return [];
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (err) {
    console.error('Failed to clear history:', err);
  }
};
