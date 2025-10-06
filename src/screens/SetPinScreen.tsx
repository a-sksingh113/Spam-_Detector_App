import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  StatusBar,
  ScrollView
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScrambledKeypad from '../components/ScrambledKeypad';

type Props = NativeStackScreenProps<RootStackParamList, 'SetPin'>;

const SetPinScreen: React.FC<Props> = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isConfirmMode, setIsConfirmMode] = useState(false);

  useEffect(() => {
    // Get the userId from AsyncStorage
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const handleSetPin = async () => {
    if (pin.length !== 4 || pin !== confirm) {
      Alert.alert('Error', 'PINs do not match or are not 4 digits.');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID missing. Try again.');
      return;
    }

    try {
      await AsyncStorage.setItem(`pin_${userId}`, pin); 
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to save PIN');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#003366"
            translucent={false}
          />
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.header}>
        {isConfirmMode ? 'Confirm PIN' : 'Create PIN for SpamWatch'}
      </Text>
      <Image
        source={require('../assets/spamsplash.png')}
        style={styles.image}
      />
      
      {/* PIN Display */}
      <View style={styles.pinContainer}>
        <Text style={styles.pinLabel}>
          {isConfirmMode ? 'Re-enter your 4-digit PIN' : 'Enter 4-digit PIN'}
        </Text>
        <View style={styles.pinDotsContainer}>
          {Array.from({ length: 4 }, (_, index) => (
            <View
              key={index}
              style={[
                styles.pinDot,
                index < (isConfirmMode ? confirm.length : pin.length) && styles.pinDotFilled,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Scrambled Keypad */}
      <ScrambledKeypad
        onKeyPress={(key) => {
          if (isConfirmMode) {
            if (confirm.length < 4) {
              setConfirm(prev => prev + key);
            }
          } else {
            if (pin.length < 4) {
              setPin(prev => prev + key);
            }
          }
        }}
        onBackspace={() => {
          if (isConfirmMode) {
            setConfirm(prev => prev.slice(0, -1));
          } else {
            setPin(prev => prev.slice(0, -1));
          }
        }}
        onClear={() => {
          if (isConfirmMode) {
            setConfirm('');
          } else {
            setPin('');
          }
        }}
        showClearButton={true}
        maxLength={4}
        currentValue={isConfirmMode ? confirm : pin}
        buttonColor="#fff"
        textColor="#2d3748"
        backgroundColor="#f7fafc"
        borderColor="#e2e8f0"
        enableVibration={false}
      />

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: (isConfirmMode ? confirm.length === 4 : pin.length === 4) ? '#003366' : '#ccc' },
        ]}
        onPress={() => {
          if (!isConfirmMode) {
            if (pin.length === 4) {
              setIsConfirmMode(true);
            }
          } else {
            handleSetPin();
          }
        }}
        disabled={isConfirmMode ? confirm.length !== 4 : pin.length !== 4}
      >
        <Text style={styles.buttonText}>
          {isConfirmMode ? 'Set PIN' : 'Continue'}
        </Text>
      </TouchableOpacity>

      {isConfirmMode && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            setIsConfirmMode(false);
            setConfirm('');
          }}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
     </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safe:{flex: 1, backgroundColor: '#fff'},
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 20 },
  header: {
    marginTop: 60,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  image: { width: 180, height: 180, alignSelf: 'center', marginVertical: 20 },
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
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'transparent',
    padding: 10,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: { color: '#fff', fontSize: 16 },
  backButtonText: { color: '#666', fontSize: 16 },
});

export default SetPinScreen;
