import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SmsMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

export const checkSpamWithAPI = async (message: SmsMessage): Promise<void> => {
  try {
    const response = await fetch('https://model1.satishdev.me/predict1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message.content }),
    });

    const data = await response.json();
    if (data.prediction?.toLowerCase() === 'spam') {
      console.log('SPAM detected:', message.content);
      await saveSpamMessage(message);
    }
  } catch (err) {
    console.error('API call failed:', err);
  }
};

export const saveSpamMessage = async (message: SmsMessage) => {
  try {
    const existing = await AsyncStorage.getItem('spamMessages');
    const spamList: SmsMessage[] = existing ? JSON.parse(existing) : [];

    // Avoid duplicates by checking both id and timestamp
    const exists = spamList.some(
      (m) => m.id === message.id && m.timestamp === message.timestamp
    );

    if (!exists) {
      const updatedList = [message, ...spamList];
      await AsyncStorage.setItem('spamMessages', JSON.stringify(updatedList));
    }
  } catch (e) {
    console.error('Error saving spam message:', e);
  }
};

