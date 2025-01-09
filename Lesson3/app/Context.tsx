import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context
type MessageContextType = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
};

// Create the context
export const MessageContext = createContext<MessageContextType | null>(null);

// Provider component
type ProviderProps = {
  children: ReactNode;
};

 const MessageProvider = ({ children }: ProviderProps) => {
  const [message, setMessage] = useState<string>('Hello, React Native!');

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

// Hook for consuming the context
export default MessageProvider;