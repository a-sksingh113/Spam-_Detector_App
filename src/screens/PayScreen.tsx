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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScrambledKeypad from '../components/ScrambledKeypad';

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

  const statusMessages = ['Processing your payment...'];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loading) {
      interval = setInterval(() => {
        setStatusIndex(prev => (prev + 1) % statusMessages.length);
      }, 2500);
    }

    return () => clearInterval(interval);
  }, [loading]);

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
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#003366" />
      <View style={styles.container}>
        <Text style={styles.title}>Make a Payment</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Amount in Rs"
           placeholderTextColor="#999"
          value={amount}
          keyboardType="numeric"
          onChangeText={setAmount}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Merchant ID"
           placeholderTextColor="#999"
          value={merchantId}
          onChangeText={setMerchantId}
        />

        <Text style={styles.label}>Select Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={value => setCategory(value)}
          >
            {Object.keys(categoryMap).map(key => (
              <Picker.Item key={key} label={key} value={key} color="#999"/>
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePay}>
          <Text style={styles.buttonText}>Pay</Text>
        </TouchableOpacity>
      </View>

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
  modalBackground1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox1: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red',
  },
  modalText1: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalCountdown1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'orange',
    marginBottom: 20,
  },
  modalButtons1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button1: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton1: {
    backgroundColor: '#ccc',
  },
  proceedButton1: {
    backgroundColor: '#ff4d4d',
  },
  buttonText1: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
  },

  safe: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 31,
    marginBottom: 43,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    width: 354,
    height: 50,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
     color: '#000',
  },
  label: {
    marginTop: 15,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#000203ff',
    width: 100,
    paddingVertical: 14,
    borderRadius: 50,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fefefeff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox: {
    width: 370,
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBoxLarge: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    maxHeight: '80%',
  },
  pinContainer: {
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  pinLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 15,
    textAlign: 'center',
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e0',
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  disabled: {
    opacity: 0.6,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
  },
});
