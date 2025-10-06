import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScrambledKeypad from '../components/ScrambledKeypad';

const PinEntryScreen = ({ navigation }: any) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirmMode, setIsConfirmMode] = useState(false);
  const maxPinLength = 6;

  const handleKeyPress = (key: string) => {
    if (isConfirmMode) {
      if (confirmPin.length < maxPinLength) {
        setConfirmPin(prev => prev + key);
      }
    } else {
      if (pin.length < maxPinLength) {
        setPin(prev => prev + key);
      }
    }
  };

  const handleBackspace = () => {
    if (isConfirmMode) {
      setConfirmPin(prev => prev.slice(0, -1));
    } else {
      setPin(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (isConfirmMode) {
      setConfirmPin('');
    } else {
      setPin('');
    }
  };

  const handleContinue = () => {
    if (!isConfirmMode) {
      if (pin.length === maxPinLength) {
        setIsConfirmMode(true);
      } else {
        Alert.alert('Error', `Please enter ${maxPinLength} digit PIN`);
      }
    } else {
      if (confirmPin.length === maxPinLength) {
        if (pin === confirmPin) {
          Alert.alert('Success', 'PIN set successfully!', [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]);
        } else {
          Alert.alert('Error', 'PINs do not match. Please try again.', [
            {
              text: 'OK',
              onPress: () => {
                setIsConfirmMode(false);
                setPin('');
                setConfirmPin('');
              },
            },
          ]);
        }
      } else {
        Alert.alert('Error', `Please enter ${maxPinLength} digit PIN`);
      }
    }
  };

  const handleGoBack = () => {
    if (isConfirmMode) {
      setIsConfirmMode(false);
      setConfirmPin('');
    } else {
      navigation.goBack();
    }
  };

  const renderPinDots = (currentPin: string) => {
    return (
      <View style={styles.pinDotsContainer}>
        {Array.from({ length: maxPinLength }, (_, index) => (
          <View
            key={index}
            style={[
              styles.pinDot,
              index < currentPin.length && styles.pinDotFilled,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color="#2d3748" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isConfirmMode ? 'Confirm PIN' : 'Set PIN'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* PIN Display */}
        <View style={styles.pinSection}>
          <Text style={styles.pinTitle}>
            {isConfirmMode 
              ? 'Re-enter your 6-digit PIN' 
              : 'Create a 6-digit PIN for secure transactions'
            }
          </Text>
          {renderPinDots(isConfirmMode ? confirmPin : pin)}
        </View>

        {/* Scrambled Keypad */}
        <ScrambledKeypad
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onClear={handleClear}
          showClearButton={true}
          maxLength={maxPinLength}
          currentValue={isConfirmMode ? confirmPin : pin}
          buttonColor="#fff"
          textColor="#2d3748"
          backgroundColor="#f7fafc"
          borderColor="#e2e8f0"
        />

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            ((isConfirmMode ? confirmPin.length : pin.length) === maxPinLength) 
              ? styles.continueButtonActive 
              : styles.continueButtonInactive
          ]}
          onPress={handleContinue}
          disabled={(isConfirmMode ? confirmPin.length : pin.length) !== maxPinLength}
        >
          <Text style={[
            styles.continueButtonText,
            ((isConfirmMode ? confirmPin.length : pin.length) === maxPinLength) 
              ? styles.continueButtonTextActive 
              : styles.continueButtonTextInactive
          ]}>
            {isConfirmMode ? 'Confirm PIN' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3748',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  pinSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  pinTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a5568',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
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
  continueButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonActive: {
    backgroundColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonInactive: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  continueButtonTextActive: {
    color: '#fff',
  },
  continueButtonTextInactive: {
    color: '#a0aec0',
  },
});

export default PinEntryScreen;