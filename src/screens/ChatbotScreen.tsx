import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { findBestIntent } from '../utils/ChatbotIntents';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'balance' | 'transaction' | 'spam' | 'loading';
  data?: any;
}

interface SmsMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

const ChatbotScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const pulseAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: "Hi! I'm your Spam Detector Assistant. I can help you with:\n\n• Check your balance\n• View transaction history\n• Show spam messages\n• Detect spam links\n• Banking security tips\n\nWhat would you like to know?",
      isUser: false,
      timestamp: new Date(),
      type: 'text',
    };
    setMessages([welcomeMessage]);

    // Start pulse animation for loading dots
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [pulseAnim]);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Enhanced intent classification using the intents file
  const classifyIntent = (text: string): string => {
    const matchedIntent = findBestIntent(text);
    const intent = matchedIntent ? matchedIntent.intent : 'general';
    console.log('Classified intent for "' + text + '":', intent);
    return intent;
  };

  // Check balance API call (Using axios for consistency)
  const checkBalance = async (): Promise<string> => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('Checking balance for userId:', userId);
      
      if (!userId) {
        return "❌ I couldn't find your user ID. Please make sure you're logged in.";
      }

      const response = await axios.post(
        'https://api.ucohakethon.pixbit.me/api/tranction/check-balance',
        { userId }
      );

      console.log('Balance API response:', response.data);
      
      if (response.data.success) {
        const balance = parseFloat(response.data.balance) || 0;
        const formattedBalance = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2,
        }).format(balance);
        
        return `💰 Your current account balance is ${formattedBalance}`;
      } else {
        return `❌ API Error: ${response.data.message || 'Could not retrieve your balance at the moment. Please try again later.'}`;
      }
    } catch (error) {
      console.error('Balance check error:', error);
      return "❌ Network error occurred while checking your balance. Please check your internet connection and try again.";
    }
  };

  // Get transaction history (Using exact same approach as PaymentHistory)
  const getTransactionHistory = async (): Promise<string> => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('Fetching transaction history for userId:', userId);
      
      if (!userId) {
        return "❌ I couldn't find your user ID. Please make sure you're logged in.";
      }

      const response = await axios.post(
        'https://api.ucohakethon.pixbit.me/api/tranction/transactions-history',
        { userId }
      );

      console.log('Transaction API response:', response.data);

      if (response.data.success) {
        // Use exact same logic as PaymentHistory
        const sent = response.data.sentTransactions.map((item: any) => ({
          ...item,
          type: 'sent',
        }));
        const received = response.data.receivedTransactions.map((item: any) => ({
          ...item,
          type: 'received',
        }));
        const allTransactions = [...sent, ...received].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        if (allTransactions.length === 0) {
          return "📋 No recent transactions found in your account.";
        }
        
        const totalTransactions = allTransactions.length;
        let historyText = `📋 Your Recent Transactions (${totalTransactions} total):\n\n`;
        
        allTransactions.slice(0, 5).forEach((txn: any, index: number) => {
          const amount = parseFloat(txn.amount) || 0;
          const formattedAmount = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
          }).format(amount);
          
          const type = txn.type === 'sent' ? '💸 Sent' : '💰 Received';
          const sign = txn.type === 'sent' ? '-' : '+';
          
          historyText += `${index + 1}. ${type}: ${sign}${formattedAmount}\n`;
          historyText += `   To/From: ${txn.name || 'Unknown'}\n`;
          historyText += `   Date: ${new Date(txn.date).toLocaleDateString('en-IN')}\n`;
          historyText += `   Transaction ID: ${txn.merchantID || 'N/A'}\n\n`;
        });
        
        if (totalTransactions > 5) {
          historyText += `💡 Showing latest 5 transactions. You have ${totalTransactions - 5} more transactions.`;
        }
        
        return historyText;
      } else {
        return `❌ API Error: ${response.data.message || 'Could not retrieve your transaction history. Please try again later.'}`;
      }
    } catch (error) {
      console.error('Transaction history error:', error);
      return "❌ Network error occurred while fetching your transaction history. Please check your internet connection and try again.";
    }
  };

  // Get spam messages
  const getSpamMessages = async (): Promise<string> => {
    try {
      const raw = await AsyncStorage.getItem('spamMessages');
      const spamMessages: SmsMessage[] = raw ? JSON.parse(raw) : [];
      
      if (spamMessages.length === 0) {
        return "🛡️ Great news! You don't have any spam messages in your folder.";
      }
      
      const spamCount = spamMessages.length;
      const uniqueSenders = new Set(spamMessages.map(msg => msg.sender)).size;
      
      let responseText = `🚨 You have ${spamCount} spam messages from ${uniqueSenders} different senders.\n\nRecent spam messages:\n\n`;
      
      // Show last 3 spam messages
      const recentSpam = spamMessages.slice(-3);
      recentSpam.forEach((msg, index) => {
        const shortContent = msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content;
        responseText += `${index + 1}. From: ${msg.sender}\n   "${shortContent}"\n   ${new Date(msg.timestamp).toLocaleDateString()}\n\n`;
      });
      
      responseText += "💡 Tip: Always be cautious with messages asking for personal information or containing suspicious links!";
      
      return responseText;
    } catch (error) {
      console.error('Spam messages error:', error);
      return "There was an error retrieving your spam messages. Please try again.";
    }
  };

  // Handle different intents
  const handleIntent = async (intent: string, userText: string): Promise<Message> => {
    let responseText = '';
    let messageType: 'text' | 'balance' | 'transaction' | 'spam' = 'text';
    
    switch (intent) {
      case 'check_balance':
        responseText = await checkBalance();
        messageType = 'balance';
        break;
        
      case 'transaction_history':
        responseText = await getTransactionHistory();
        messageType = 'transaction';
        break;
        
      case 'spam_messages':
        responseText = await getSpamMessages();
        messageType = 'spam';
        break;
        
      case 'spam_links':
        responseText = "🔗 Spam links are malicious URLs that can:\n\n• Steal your personal information\n• Install malware on your device\n• Lead to phishing websites\n• Trick you into fake payments\n\n🛡️ Safety tips:\n• Never click suspicious links\n• Verify sender before clicking\n• Use official banking apps only\n• Check URL carefully before entering details";
        break;
        
      case 'security_tips':
        responseText = "🔒 Banking Security Tips:\n\n• Enable 2FA on all accounts\n• Use strong, unique passwords\n• Never share OTPs or PINs\n• Always verify bank communications\n• Use official banking apps only\n• Regularly monitor your accounts\n• Report suspicious activities immediately\n\n💡 Remember: Banks never ask for sensitive information via SMS or calls!";
        break;
        
      case 'help':
        responseText = "🤖 I can help you with:\n\n💰 Balance Queries:\n• \"What's my balance?\"\n• \"How much money do I have?\"\n• \"Show my current balance\"\n\n📋 Transaction History:\n• \"Show my recent transactions\"\n• \"What are my latest payments?\"\n• \"Display transaction history\"\n\n🚨 Spam Detection:\n• \"How many spam messages do I have?\"\n• \"Show me spam messages\"\n• \"Tell me about spam links\"\n\n🔒 Security:\n• \"Give me banking security tips\"\n• \"How can I stay safe?\"\n• \"What about fraud protection?\"\n\nJust ask me naturally - I understand many ways of asking!";
        break;

      case 'greeting':
        responseText = "Hello! � I'm your personal Spam Detective AI assistant. I'm here to help you with:\n\n• Checking your account balance\n• Viewing transaction history\n• Managing spam messages\n• Providing security tips\n\nWhat would you like to know today?";
        break;

      case 'goodbye':
        responseText = "Thank you for using Spam Detective AI! 🛡️\n\nStay safe and secure with your banking. Feel free to ask me anything anytime you need help with your account or security concerns.\n\nHave a great day! 😊";
        break;

      case 'account_info':
        responseText = "I can help you with account-related information! Here's what I can show you:\n\n• Your current account balance\n• Recent transaction history\n• Payment records\n• Security status\n\nWhat specific account information would you like to see?";
        break;

      case 'payment_info':
        responseText = "For making payments, here are the safe practices:\n\n💳 Payment Safety:\n• Always verify recipient details\n• Use official banking apps only\n• Double-check payment amounts\n• Keep transaction receipts\n• Never share payment OTPs\n\n📱 Use your banking app's payment feature for secure transactions. Would you like to see your recent payments?";
        break;

      case 'fraud_detection':
        responseText = "🚨 Fraud Detection & Prevention:\n\n⚠️ Warning Signs:\n• Unexpected transaction alerts\n• Unknown login attempts\n• Suspicious SMS/emails\n• Unusual account activity\n\n🛡️ Immediate Actions:\n• Contact your bank immediately\n• Change passwords\n• Block cards if needed\n• Report to authorities\n\nWould you like me to check your recent transactions for any suspicious activity?";
        break;
        
      default:
        responseText = "I understand you're asking something, but I'm not quite sure how to help with that specific request. 🤔\n\nI can help you with:\n• Checking your balance\n• Viewing transaction history\n• Managing spam messages\n• Banking security tips\n• Account information\n\nTry asking in a different way or say 'help' to see all my capabilities!";
        break;
    }
    
    return {
      id: Date.now().toString(),
      text: responseText,
      isUser: false,
      timestamp: new Date(),
      type: messageType,
    };
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
      type: 'text',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    scrollToBottom();
    
    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: 'Thinking...',
      isUser: false,
      timestamp: new Date(),
      type: 'loading',
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    
    try {
      const intent = classifyIntent(userMessage.text);
      const botResponse = await handleIntent(intent, userMessage.text);
      
      // Remove loading message and add bot response
      setMessages(prev => prev.slice(0, -1).concat(botResponse));
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "Sorry, I encountered an error while processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => prev.slice(0, -1).concat(errorMessage));
    }
    
    setIsLoading(false);
    scrollToBottom();
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.botMessage
    ]}>
      {!item.isUser && (
        <View style={styles.botAvatar}>
          <Ionicons name="chatbot" size={20} color="#667eea" />
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.botBubble,
        item.type === 'loading' && styles.loadingBubble
      ]}>
        {item.type === 'loading' ? (
          <View style={styles.loadingContainer}>
            <Animated.Text style={[styles.loadingDots, { opacity: pulseAnim }]}>
              ●●●
            </Animated.Text>
          </View>
        ) : (
          <Text style={[
            styles.messageText,
            item.isUser ? styles.userText : styles.botText
          ]}>
            {item.text}
          </Text>
        )}
        
        <Text style={[
          styles.timestamp,
          item.isUser ? styles.userTimestamp : styles.botTimestamp
        ]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      
      {item.isUser && (
        <View style={styles.userAvatar}>
          <Ionicons name="person" size={20} color="#ffffff" />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#667eea" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="chatbot" size={28} color="#ffffff" />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Spam Detective AI</Text>
              <Text style={styles.headerSubtitle}>Your Personal Banking Assistant</Text>
            </View>
          </View>
          <View style={styles.onlineIndicator}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              onFocus={scrollToBottom}
              placeholder="Ask me anything"
              placeholderTextColor="#9ca3af"
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : null]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? "#ffffff" : "#9ca3af"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#e0e7ff',
    marginTop: 2,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  onlineText: {
    fontSize: 12,
    color: '#e0e7ff',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#667eea',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  loadingBubble: {
    backgroundColor: '#f3f4f6',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  botText: {
    color: '#374151',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: '#e0e7ff',
    textAlign: 'right',
  },
  botTimestamp: {
    color: '#9ca3af',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDots: {
    fontSize: 20,
    color: '#9ca3af',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: Platform.OS === 'ios' ? 0 : 0,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#374151',
    backgroundColor: '#f9fafb',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonActive: {
    backgroundColor: '#667eea',
  },
});

export default ChatbotScreen;