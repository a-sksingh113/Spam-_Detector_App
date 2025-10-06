import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScrambledKeypad from '../components/ScrambledKeypad';


const SetPinScreen: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentStep, setCurrentStep] = useState(0); // 0: phone, 1: pin, 2: confirmPin

  const handleSetPin = async () => {
    if (!phone || !pin || !confirmPin) {
      Alert.alert('Missing Info', 'Please fill all fields');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('Mismatch', 'PIN and Confirm PIN must match');
      return;
    }

    try {
      const response = await fetch('https://api.ucohakethon.pixbit.me/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (data.success) {
        const matchedUserId = data.user._id;

        const storedUserId = await AsyncStorage.getItem('userId');

        if (matchedUserId === storedUserId) {
         
          await AsyncStorage.setItem('userPin', pin);
          Alert.alert('Success', 'PIN updated successfully! You are now logged in.');
         
        } else {
          Alert.alert('User mismatch', 'This phone number does not match your account.');
        }
      } else {
        Alert.alert('Login failed', 'Invalid phone number.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong. Try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Change Your PIN</Text>

        {currentStep === 0 && (
          <View>
            <TextInput
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TouchableOpacity 
              style={[styles.button, !phone && styles.disabled]} 
              onPress={() => phone && setCurrentStep(1)}
              disabled={!phone}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {(currentStep === 1 || currentStep === 2) && (
          <View>
            {/* PIN Display */}
            <View style={styles.pinContainer}>
              <Text style={styles.pinLabel}>
                {currentStep === 1 ? 'Enter new 4-digit PIN' : 'Confirm your PIN'}
              </Text>
              <View style={styles.pinDotsContainer}>
                {Array.from({ length: 4 }, (_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.pinDot,
                      index < (currentStep === 1 ? pin.length : confirmPin.length) && styles.pinDotFilled,
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Scrambled Keypad */}
            <ScrambledKeypad
              onKeyPress={(key) => {
                if (currentStep === 1) {
                  if (pin.length < 4) {
                    setPin(prev => prev + key);
                  }
                } else {
                  if (confirmPin.length < 4) {
                    setConfirmPin(prev => prev + key);
                  }
                }
              }}
              onBackspace={() => {
                if (currentStep === 1) {
                  setPin(prev => prev.slice(0, -1));
                } else {
                  setConfirmPin(prev => prev.slice(0, -1));
                }
              }}
              onClear={() => {
                if (currentStep === 1) {
                  setPin('');
                } else {
                  setConfirmPin('');
                }
              }}
              showClearButton={true}
              maxLength={4}
              currentValue={currentStep === 1 ? pin : confirmPin}
              buttonColor="#fff"
              textColor="#2d3748"
              backgroundColor="#f7fafc"
              borderColor="#e2e8f0"
              enableVibration={false}
            />

            <TouchableOpacity 
              style={[
                styles.button, 
                (currentStep === 1 ? pin.length !== 4 : confirmPin.length !== 4) && styles.disabled
              ]} 
              onPress={() => {
                if (currentStep === 1) {
                  if (pin.length === 4) {
                    setCurrentStep(2);
                  }
                } else {
                  handleSetPin();
                }
              }}
              disabled={currentStep === 1 ? pin.length !== 4 : confirmPin.length !== 4}
            >
              <Text style={styles.buttonText}>
                {currentStep === 1 ? 'Continue' : 'Save PIN'}
              </Text>
            </TouchableOpacity>

            {currentStep === 2 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  setCurrentStep(1);
                  setConfirmPin('');
                }}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '600',
    color: '#003366',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    color: '#000',
  },
  pinContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  pinLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 20,
    textAlign: 'center',
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 10,
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#cbd5e0',
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    backgroundColor: '#003366',
    borderColor: '#003366',
  },
  button: {
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabled: {
    opacity: 0.6,
  },
  backButton: {
    backgroundColor: 'transparent',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: { color: '#fff', fontSize: 16 },
  backButtonText: { color: '#666', fontSize: 16 },
});

export default SetPinScreen;
