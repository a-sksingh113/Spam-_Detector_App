import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Modal,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScrambledKeypad from '../components/ScrambledKeypad';

const { width, height } = Dimensions.get('window');

const genderMap: { [key: string]: number } = { female: 1, male: 2, Other: 3 };

const ageMap: { [key: string]: number } = {
  '0-20': 0,
  '20-30': 1,
  '30-40': 2,
  '40-50': 3,
  '50-60': 4,
  '60-70': 5,
  '70+': 6,
};

const categoryMap: { [key: string]: number } = {
  es_transportation: 0,
  es_health: 1,
  es_otherservices: 2,
  es_food: 3,
  es_hotelservices: 4,
  es_barsandrestaurants: 5,
  es_tech: 6,
  es_sportsandtoys: 7,
  es_wellnessandbeauty: 8,
  es_hyper: 9,
  es_fashion: 10,
  es_home: 11,
  es_contents: 12,
  es_travel: 13,
  es_leisure: 14,
};

const merchantMap: { [key: string]: number } = {
  M1823072687: 299693,
  M348934600: 205426,
  M85975013: 26254,
  M1053599405: 6821,
  M151143676: 6373,
  M855959430: 6098,
  M1946091778: 5343,
  M1913465890: 3988,
  M209847108: 3814,
  M480139044: 3508,
  M349281107: 2881,
  M1600850729: 2624,
  M1535107174: 1868,
  M980657600: 1769,
  M78078399: 1608,
  M1198415165: 1580,
  M840466850: 1399,
  M1649169323: 1173,
  M547558035: 949,
  M50039827: 916,
  M1888755466: 912,
  M692898500: 900,
  M1400236507: 776,
  M1842530320: 751,
  M732195782: 608,
  M97925176: 599,
  M45060432: 573,
  M1741626453: 528,
  M1313686961: 527,
  M1872033263: 525,
  M1352454843: 370,
  M677738360: 358,
  M2122776122: 341,
  M923029380: 323,
  M3697346: 308,
  M17379832: 282,
  M1748431652: 274,
  M1873032707: 250,
  M2011752106: 244,
  M1416436880: 220,
  M1294758098: 191,
  M1788569036: 181,
  M857378720: 122,
  M348875670: 107,
  M1353266412: 78,
  M495352832: 69,
  M933210764: 69,
  M2080407379: 48,
  M117188757: 21,
  M1726401631: 3,
};

const PayScreen = () => {
  const [amount, setAmount] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [category, setCategory] = useState('es_transportation');
  const [loading, setLoading] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [showPinModal, setShowPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [storedPin, setStoredPin] = useState('');
  const [pin, setPin] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [showFraudModal, setShowFraudModal] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [fraudTimer, setFraudTimer] = useState<NodeJS.Timeout | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);

  const statusMessages = ['Processing your payment...'];

  // Fetch user balance
  const fetchBalance = async () => {
    try {
      setBalanceLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        setBalanceLoading(false);
        return;
      }

      const response = await fetch(
        'https://api.ucohakethon.pixbit.me/api/tranction/check-balance',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await response.json();
      if (data.success !== false && data.balance !== undefined) {
        setBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setBalanceLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loading) {
      interval = setInterval(() => {
        setStatusIndex(prev => (prev + 1) % statusMessages.length);
      }, 2500);
    }

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    fetchBalance();
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      const genderRaw = await AsyncStorage.getItem('gender');
      const ageRaw = await AsyncStorage.getItem('age');
      const customerID = await AsyncStorage.getItem('customerID');

      if (!userId || !genderRaw || !ageRaw || !customerID) {
        setLoading(false);
        Alert.alert('Error', 'User data missing. Please login again.');
        return;
      }

      let ageGroup = '0-20';
      const ageNum = parseInt(ageRaw);
      if (ageNum > 70) ageGroup = '70+';
      else if (ageNum > 60) ageGroup = '60-70';
      else if (ageNum > 50) ageGroup = '50-60';
      else if (ageNum > 40) ageGroup = '40-50';
      else if (ageNum > 30) ageGroup = '30-40';
      else if (ageNum > 20) ageGroup = '20-30';

      const gender = genderMap[genderRaw.toLowerCase()] ?? 3;
      const age = ageMap[ageGroup] ?? 0;
      const merchantEncoded = merchantMap[merchantId];

      if (merchantEncoded === undefined) {
        setLoading(false);
        Alert.alert('Error', 'Merchant ID not recognized.');
        return;
      }

      const customer = parseInt(customerID.replace(/\D/g, ''));
      const data = {
        step: 0,
        customer,
        age,
        gender,
        merchant: merchantEncoded,
        category: categoryMap[category],
        amount: parseInt(amount),
      };

      const aiResponse = await axios.post(
        'https://model3.pixbit.me/predict3',
        { data },
      );
      if (!aiResponse || aiResponse.data.prediction === 1) {
        setLoading(false);
        setCountdown(10); // reset timer
        setShowFraudModal(true);

        // Start countdown
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setShowFraudModal(false);
              Alert.alert(
                'Cancelled',
                'Transaction was cancelled due to inaction.',
              );
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        setFraudTimer(timer);
        return;
      }

      await handleFinalPayment(userId, amount, merchantId);
    } catch (error) {
      setLoading(false);
      console.error('Payment Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };
  const handleFinalPayment = async (
    userId: string,
    amount: string,
    merchantId: string,
  ) => {
    try {
      const paymentBody = {
        userId,
        amount: parseFloat(amount),
        merchantID: merchantId,
      };

      console.log(' Initiating Payment with Body:', paymentBody);

      const paymentResponse = await axios.post(
        'https://api.ucohakethon.pixbit.me/api/tranction/pay',
        paymentBody,
      );

      setLoading(false);

      const { success, message } = paymentResponse.data;

      if (success) {
        Alert.alert(' Success', 'Payment Successful');
        setAmount('');
        setMerchantId('');
        // Refresh balance after successful payment
        fetchBalance();
      } else if (message === 'Transaction flagged by AI model.') {
        Alert.alert(
          '🚫 Blocked by Bank',
          'Your transaction is blocked by the bank as it appears fraudulent. Please contact your nearest bank branch with relevent documents',
        );
      } else {
        Alert.alert('⚠️ Payment Info', 'Payment processed with issues.');
      }
    } catch (error: any) {
      setLoading(false);

      if (error.response && error.response.data) {
        const { success, message } = error.response.data;

        console.log(' Final Payment Error:', error.response.data);

        if (message === 'Transaction flagged by AI model.') {
          Alert.alert(
            '🚫 Blocked by Bank',
            'Your transaction is blocked by the bank as it appears fraudulent. Please contact your bank.',
          );
          return;
        }
      }

      console.error(' Unknown Final Payment Error:', error);
      Alert.alert(' Error', 'Payment failed at final step.');
    }
  };

  const handlePay = async () => {
    console.log('🔔 Pay button pressed');

    if (!amount || !merchantId || !category) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // Check if balance is sufficient
    if (balance !== null && parseFloat(amount) > balance) {
      Alert.alert(
        'Insufficient Balance', 
        `Your current balance is ₹${balance.toLocaleString()}. Please enter a smaller amount or recharge your account.`
      );
      return;
    }

    try {
      const id = await AsyncStorage.getItem('userId');
      console.log('User ID from AsyncStorage:', id);

      if (!id) {
        Alert.alert('User Not Found', 'Please Login');
        return;
      }

      const savedPin = await AsyncStorage.getItem(`pin_${id}`);
      console.log(`Saved PIN for user ${id}:`, savedPin);

      if (!savedPin) {
        Alert.alert('PIN Not Set', 'Please set your PIN before proceeding');
        return;
      }

      setStoredPin(savedPin);
      setShowPinModal(true); // Show the PIN modal
    } catch (error) {
      console.error('🔴 Error in handlePay:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#667eea" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="card-outline" size={28} color="#fff" />
          <Text style={styles.headerTitle}>Make Payment</Text>
        </View>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Ionicons name="wallet-outline" size={24} color="#667eea" />
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <TouchableOpacity onPress={fetchBalance} style={styles.refreshBalanceButton}>
              <Ionicons name="refresh" size={16} color="#667eea" />
            </TouchableOpacity>
          </View>
          {balanceLoading ? (
            <View style={styles.balanceLoadingContainer}>
              <ActivityIndicator size="small" color="#667eea" />
              <Text style={styles.balanceLoadingText}>Loading balance...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.balanceAmount}>
                ₹{balance !== null ? balance.toLocaleString() : '0.00'}
              </Text>
              <Text style={styles.balanceSubtext}>**** 4829</Text>
            </>
          )}
        </View>

        {/* Payment Form */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          
          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="cash-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter Amount"
                placeholderTextColor="#94a3b8"
                value={amount}
                keyboardType="numeric"
                onChangeText={setAmount}
              />
              <Text style={styles.currencyLabel}>INR</Text>
            </View>
          </View>

          {/* Merchant ID Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="storefront-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Merchant ID"
                placeholderTextColor="#94a3b8"
                value={merchantId}
                onChangeText={setMerchantId}
              />
            </View>
          </View>

          {/* Category Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              <Ionicons name="apps-outline" size={16} color="#64748b" /> Category
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={category}
                onValueChange={value => setCategory(value)}
                style={styles.picker}
              >
                {Object.keys(categoryMap).map(key => (
                  <Picker.Item 
                    key={key} 
                    label={key.replace('es_', '').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                    value={key} 
                    color="#1e293b"
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Quick Amount Selection */}
        <View style={styles.quickAmountCard}>
          <Text style={styles.sectionTitle}>Quick Select</Text>
          <View style={styles.quickAmountGrid}>
            {['100', '500', '1000', '2000', '5000', '10000'].map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={[
                  styles.quickAmountButton,
                  amount === quickAmount && styles.quickAmountButtonActive
                ]}
                onPress={() => setAmount(quickAmount)}
              >
                <Text style={[
                  styles.quickAmountText,
                  amount === quickAmount && styles.quickAmountTextActive
                ]}>
                  ₹{quickAmount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Summary */}
        {amount && merchantId && (
          <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount</Text>
              <Text style={styles.summaryValue}>₹{amount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Processing Fee</Text>
              <Text style={styles.summaryValue}>₹0</Text>
            </View>
            {balance !== null && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Remaining Balance</Text>
                <Text style={[
                  styles.summaryValue,
                  parseFloat(amount || '0') > balance ? styles.insufficientBalance : styles.sufficientBalance
                ]}>
                  ₹{(balance - parseFloat(amount || '0')).toLocaleString()}
                </Text>
              </View>
            )}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabelTotal}>Total Amount</Text>
              <Text style={styles.summaryValueTotal}>₹{amount}</Text>
            </View>
          </View>
        )}

        {/* Pay Button */}
        <View style={styles.payButtonContainer}>
          <TouchableOpacity 
            style={[
              styles.payButton,
              (!amount || !merchantId || (balance !== null && parseFloat(amount || '0') > balance)) && styles.payButtonDisabled
            ]} 
            onPress={handlePay}
            disabled={!amount || !merchantId || (balance !== null && parseFloat(amount || '0') > balance)}
          >
            <Ionicons 
              name={balance !== null && parseFloat(amount || '0') > balance ? "alert-circle" : "shield-checkmark"} 
              size={20} 
              color="#fff" 
              style={styles.payButtonIcon} 
            />
            <Text style={styles.payButtonText}>
              {balance !== null && parseFloat(amount || '0') > balance ? "Insufficient Balance" : "Pay Securely"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/*  PIN Modal with Scrambled Keypad */}
      <Modal visible={showPinModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBoxLarge}>
            {/*  Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setEnteredPin('');
                setShowPinModal(false);
              }}
            >
              <Text style={{ fontSize: 20 }}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Enter Your PIN</Text>

            {/* PIN Display */}
            <View style={styles.pinContainer}>
              <Text style={styles.pinLabel}>Enter your 4-digit PIN to confirm payment</Text>
              <View style={styles.pinDotsContainer}>
                {Array.from({ length: 4 }, (_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.pinDot,
                      index < enteredPin.length && styles.pinDotFilled,
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Scrambled Keypad */}
            <ScrambledKeypad
              onKeyPress={(key) => {
                if (enteredPin.length < 4) {
                  setEnteredPin(prev => prev + key);
                }
              }}
              onBackspace={() => {
                setEnteredPin(prev => prev.slice(0, -1));
              }}
              onClear={() => setEnteredPin('')}
              showClearButton={true}
              maxLength={4}
              currentValue={enteredPin}
              buttonColor="#fff"
              textColor="#2d3748"
              backgroundColor="#f7fafc"
              borderColor="#e2e8f0"
              enableVibration={false}
            />

            <TouchableOpacity
              style={[styles.button, enteredPin.length !== 4 && styles.disabled]}
              onPress={() => {
                if (enteredPin === storedPin) {
                  setEnteredPin('');
                  setShowPinModal(false);
                  handlePayment(); // proceed
                } else {
                  Alert.alert(
                    'Invalid PIN',
                    'The PIN you entered is incorrect.',
                  );
                  setEnteredPin('');
                }
              }}
              disabled={enteredPin.length !== 4}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Loading modal */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>
              {statusMessages[statusIndex]}
            </Text>
          </View>
        </View>
      </Modal>
      <Modal visible={showFraudModal} transparent animationType="fade">
        <View style={styles.modalBackground1}>
          <View style={styles.modalBox1}>
            <Text style={styles.modalTitle1}>⚠️ Fraud Detected</Text>
            <Text style={styles.modalText1}>
              This transaction is flagged as potential fraud. Proceeding may
              risk your financial security.
            </Text>
            <Text style={styles.modalCountdown1}>
              Auto cancelling in {countdown} seconds...
            </Text>

            <View style={styles.modalButtons1}>
              <TouchableOpacity
                style={[styles.button1, styles.cancelButton1]}
                onPress={() => {
                  if (fraudTimer) clearInterval(fraudTimer);
                  setShowFraudModal(false);
                }}
              >
                <Text style={styles.buttonText1}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button1, styles.proceedButton1]}
                onPress={async () => {
                  if (fraudTimer) clearInterval(fraudTimer);
                  setShowFraudModal(false);
                  setLoading(true);
                  const id = await AsyncStorage.getItem('userId');
                  if (id) {
                    await handleFinalPayment(id, amount, merchantId);
                  }
                }}
              >
                <Text style={styles.buttonText1}>Proceed Anyway</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PayScreen;

const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#667eea',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
  },
  helpButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  // Scroll Container
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  // Balance Card
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
    fontWeight: '500',
    flex: 1,
  },
  refreshBalanceButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  balanceLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  balanceLoadingText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
    fontWeight: '500',
  },
  
  // Form Card
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  
  // Input Styles
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  currencyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  
  // Picker Styles
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 56,
    color: '#1e293b',
  },
  
  // Quick Amount Selection
  quickAmountCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickAmountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    width: (width - 80) / 3,
    height: 48,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickAmountButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  quickAmountTextActive: {
    color: '#fff',
  },
  
  // Summary Card
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  insufficientBalance: {
    color: '#ef4444',
  },
  sufficientBalance: {
    color: '#10b981',
  },
  summaryLabelTotal: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  summaryValueTotal: {
    fontSize: 18,
    color: '#667eea',
    fontWeight: '700',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
  
  // Pay Button
  payButtonContainer: {
    paddingVertical: 20,
    paddingBottom: 30,
  },
  payButton: {
    backgroundColor: '#667eea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  payButtonDisabled: {
    backgroundColor: '#94a3b8',
    elevation: 0,
    shadowOpacity: 0,
  },
  payButtonIcon: {
    marginRight: 8,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox: {
    width: '85%',
    maxWidth: 350,
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalBoxLarge: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    maxHeight: '80%',
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  // PIN Styles
  pinContainer: {
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  pinLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 15,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#cbd5e0',
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  
  // Button Styles
  button: {
    backgroundColor: '#667eea',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 15,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  
  // Loading
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
    color: '#64748b',
    fontWeight: '500',
  },
  
  // Fraud Modal Styles
  modalBackground1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalBox1: {
    width: '88%',
    maxWidth: 350,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle1: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#ef4444',
    textAlign: 'center',
  },
  modalText1: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#64748b',
    lineHeight: 22,
  },
  modalCountdown1: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f59e0b',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  button1: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton1: {
    backgroundColor: '#94a3b8',
  },
  proceedButton1: {
    backgroundColor: '#ef4444',
  },
  buttonText1: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
