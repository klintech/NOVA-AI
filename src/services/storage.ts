export const saveMessages = (messages: any[]) => {
  localStorage.setItem("messages", JSON.stringify(messages));
};

export const loadMessages = (): any[] => {
  const data = localStorage.getItem("messages");
  return data ? JSON.parse(data) : [];
};

export const clearMessages = () => {
  localStorage.removeItem("messages");
};

export const saveToHistory = (prompt: string) => {
  const history = loadHistory();
  const updated = [prompt, ...history.filter(item => item !== prompt)];
  localStorage.setItem("history", JSON.stringify(updated.slice(0, 20)));
};

export const loadHistory = (): string[] => {
  const data = localStorage.getItem("history");
  return data ? JSON.parse(data) : [];
};

export const clearHistory = () => {
  localStorage.removeItem("history");
};
