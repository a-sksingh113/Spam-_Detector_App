// ChatbotIntents.ts
export interface Intent {
  intent: string;
  patterns: string[];
  responses: string[];
  action?: string;
}

export const chatbotIntents: Intent[] = [
  // BALANCE CHECK INTENTS (50 variations)
  {
    intent: 'check_balance',
    patterns: [
      'check my balance',
      'show my balance',
      'what is my balance',
      'how much money do i have',
      'current balance',
      'account balance',
      'balance check',
      'tell me my balance',
      'display my balance',
      'my account balance',
      'how much balance',
      'show balance',
      'check balance',
      'what\'s my balance',
      'balance inquiry',
      'available balance',
      'remaining balance',
      'money left',
      'funds available',
      'account funds',
      'wallet balance',
      'total balance',
      'current funds',
      'available funds',
      'my money',
      'how much do i have',
      'balance status',
      'account status',
      'financial status',
      'money status',
      'cash available',
      'available cash',
      'account summary',
      'balance summary',
      'fund status',
      'current account balance',
      'show me my money',
      'how much money is there',
      'what\'s in my account',
      'account details',
      'balance details',
      'check my account',
      'view balance',
      'see balance',
      'balance info',
      'account info',
      'money details',
      'cash details',
      'fund details',
      'balance amount'
    ],
    responses: [],
    action: 'fetch_balance'
  },

  // TRANSACTION HISTORY INTENTS (60 variations)
  {
    intent: 'transaction_history',
    patterns: [
      'transaction history',
      'payment history',
      'show transactions',
      'my transactions',
      'recent transactions',
      'transaction list',
      'payment list',
      'show payments',
      'my payments',
      'recent payments',
      'transaction details',
      'payment details',
      'account history',
      'spending history',
      'money history',
      'financial history',
      'transfer history',
      'transaction record',
      'payment record',
      'account activity',
      'recent activity',
      'transaction activity',
      'payment activity',
      'money movements',
      'fund transfers',
      'bank transactions',
      'banking history',
      'transaction log',
      'payment log',
      'account transactions',
      'all transactions',
      'complete history',
      'full history',
      'transaction summary',
      'payment summary',
      'expense history',
      'income history',
      'money flow',
      'cash flow',
      'financial activity',
      'account movements',
      'transaction report',
      'payment report',
      'spending report',
      'financial report',
      'transaction overview',
      'payment overview',
      'account overview',
      'money transactions',
      'cash transactions',
      'digital transactions',
      'online transactions',
      'mobile transactions',
      'banking activity',
      'financial movements',
      'account records',
      'transaction entries',
      'payment entries',
      'money entries',
      'transaction data',
      'payment data',
      'transaction info'
    ],
    responses: [],
    action: 'fetch_transactions'
  },

  // SPAM MESSAGES INTENTS (40 variations)
  {
    intent: 'spam_messages',
    patterns: [
      'spam messages',
      'show spam',
      'spam folder',
      'junk messages',
      'spam sms',
      'spam texts',
      'unwanted messages',
      'blocked messages',
      'suspicious messages',
      'fraudulent messages',
      'scam messages',
      'phishing messages',
      'malicious messages',
      'dangerous messages',
      'harmful messages',
      'threat messages',
      'spam count',
      'how many spam',
      'spam statistics',
      'spam list',
      'spam report',
      'spam summary',
      'spam overview',
      'spam details',
      'spam analysis',
      'spam detection',
      'spam filter',
      'spam protection',
      'spam security',
      'spam alerts',
      'spam warnings',
      'spam notifications',
      'spam inbox',
      'spam quarantine',
      'spam storage',
      'spam archive',
      'spam database',
      'spam log',
      'spam history',
      'spam records'
    ],
    responses: [],
    action: 'fetch_spam'
  },

  // SPAM LINKS INTENTS (35 variations)
  {
    intent: 'spam_links',
    patterns: [
      'spam links',
      'malicious links',
      'dangerous links',
      'suspicious links',
      'phishing links',
      'scam links',
      'fraudulent links',
      'harmful links',
      'unsafe links',
      'bad links',
      'virus links',
      'malware links',
      'trojan links',
      'infected links',
      'compromised links',
      'threat links',
      'risky links',
      'blocked links',
      'blacklisted links',
      'quarantined links',
      'reported links',
      'flagged links',
      'suspicious urls',
      'malicious urls',
      'dangerous urls',
      'phishing urls',
      'scam urls',
      'fraudulent urls',
      'harmful urls',
      'unsafe urls',
      'bad urls',
      'virus urls',
      'malware urls',
      'link security',
      'url protection'
    ],
    responses: [],
    action: 'spam_links_info'
  },

  // SECURITY TIPS INTENTS (30 variations)
  {
    intent: 'security_tips',
    patterns: [
      'security tips',
      'banking security',
      'safe banking',
      'security advice',
      'protection tips',
      'safety tips',
      'fraud prevention',
      'scam prevention',
      'security guidelines',
      'banking safety',
      'account protection',
      'financial security',
      'money safety',
      'secure banking',
      'bank safety',
      'security measures',
      'protection measures',
      'safety measures',
      'security practices',
      'safe practices',
      'security protocol',
      'safety protocol',
      'fraud protection',
      'scam protection',
      'security awareness',
      'safety awareness',
      'cybersecurity',
      'digital security',
      'online security',
      'mobile security'
    ],
    responses: [],
    action: 'security_info'
  },

  // HELP INTENTS (25 variations)
  {
    intent: 'help',
    patterns: [
      'help',
      'help me',
      'what can you do',
      'commands',
      'options',
      'features',
      'capabilities',
      'functions',
      'services',
      'assistance',
      'support',
      'guide',
      'instructions',
      'how to use',
      'usage',
      'manual',
      'tutorial',
      'documentation',
      'info',
      'information',
      'about',
      'what is this',
      'how does this work',
      'explain',
      'show options'
    ],
    responses: [],
    action: 'show_help'
  },

  // GREETING INTENTS (20 variations)
  {
    intent: 'greeting',
    patterns: [
      'hello',
      'hi',
      'hey',
      'good morning',
      'good afternoon',
      'good evening',
      'greetings',
      'howdy',
      'what\'s up',
      'sup',
      'yo',
      'hiya',
      'good day',
      'morning',
      'afternoon',
      'evening',
      'nice to meet you',
      'pleased to meet you',
      'how are you',
      'how do you do'
    ],
    responses: [],
    action: 'greeting_response'
  },

  // ACCOUNT INQUIRIES (15 variations)
  {
    intent: 'account_info',
    patterns: [
      'account information',
      'my account',
      'account details',
      'account summary',
      'account status',
      'profile information',
      'user profile',
      'my profile',
      'account overview',
      'personal information',
      'account data',
      'user data',
      'profile details',
      'account settings',
      'user settings'
    ],
    responses: [],
    action: 'account_info'
  },

  // PAYMENT INQUIRIES (20 variations)
  {
    intent: 'payment_info',
    patterns: [
      'make payment',
      'send money',
      'transfer funds',
      'pay someone',
      'payment options',
      'how to pay',
      'payment methods',
      'money transfer',
      'fund transfer',
      'send payment',
      'make transfer',
      'payment process',
      'payment procedure',
      'how to transfer',
      'transfer money',
      'payment instructions',
      'transfer instructions',
      'payment guide',
      'transfer guide',
      'payment help'
    ],
    responses: [],
    action: 'payment_info'
  },

  // FRAUD DETECTION (15 variations)
  {
    intent: 'fraud_detection',
    patterns: [
      'fraud detection',
      'detect fraud',
      'suspicious activity',
      'unusual activity',
      'fraudulent activity',
      'scam detection',
      'identify scam',
      'fraud alert',
      'suspicious transaction',
      'unauthorized transaction',
      'fraudulent transaction',
      'report fraud',
      'fraud report',
      'suspicious behavior',
      'abnormal activity'
    ],
    responses: [],
    action: 'fraud_info'
  },

  // THANK YOU / GOODBYE (10 variations)
  {
    intent: 'goodbye',
    patterns: [
      'thank you',
      'thanks',
      'bye',
      'goodbye',
      'see you later',
      'take care',
      'have a good day',
      'thanks for your help',
      'appreciate it',
      'that\'s all'
    ],
    responses: [],
    action: 'goodbye_response'
  }
];

// Intent matching function
export const findBestIntent = (userInput: string): Intent | null => {
  const input = userInput.toLowerCase().trim();
  let bestMatch: Intent | null = null;
  let highestScore = 0;

  for (const intent of chatbotIntents) {
    for (const pattern of intent.patterns) {
      const score = calculateSimilarity(input, pattern.toLowerCase());
      if (score > highestScore) {
        highestScore = score;
        bestMatch = intent;
      }
    }
  }

  // Return match if score is above threshold
  return highestScore > 0.3 ? bestMatch : null;
};

// Calculate similarity between two strings
const calculateSimilarity = (str1: string, str2: string): number => {
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  
  let matchCount = 0;
  const totalWords = Math.max(words1.length, words2.length);
  
  for (const word1 of words1) {
    for (const word2 of words2) {
      if (word1 === word2 || word1.includes(word2) || word2.includes(word1)) {
        matchCount++;
        break;
      }
    }
  }
  
  return matchCount / totalWords;
};

export default chatbotIntents;