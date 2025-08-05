import React, { createContext, useState, useContext } from 'react';

export type SmsMessage = {
  id: string;
  sender: string;
  content: string;
  time: string;
  date: number;
};

type MessagesContextType = {
  allMessages: SmsMessage[];
  setAllMessages: React.Dispatch<React.SetStateAction<SmsMessage[]>>;
  spamMessages: SmsMessage[];
  setSpamMessages: React.Dispatch<React.SetStateAction<SmsMessage[]>>;
};

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allMessages, setAllMessages] = useState<SmsMessage[]>([]);
  const [spamMessages, setSpamMessages] = useState<SmsMessage[]>([]);

  return (
    <MessagesContext.Provider value={{ allMessages, setAllMessages, spamMessages, setSpamMessages }}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) throw new Error("useMessages must be used within MessagesProvider");
  return context;
};
