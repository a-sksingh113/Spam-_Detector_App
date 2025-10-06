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
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScrambledKeypad from '../components/ScrambledKeypad';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);

      if (!id) {
        return navigation.replace('Register');
      }
      const saved = await AsyncStorage.getItem(`pin_${id}`);
      setStoredPin(saved);
    };

    init();
  }, []);

  const handleLogin = () => {
    if (storedPin === null) {
      return navigation.replace('SetPin', { userId: userId! });
    }

    if (pin === storedPin) {
      navigation.replace('Home');
    } else {
      Alert.alert('Invalid PIN', 'Please enter the correct PIN.');
    }
  };

  const handleForgot = () => {
    navigation.navigate('ForgotPin');
  };

  return (
    <SafeAreaView style={styles.loginsafe}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#003366"
            translucent={false}
          />
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.header}>Welcome to DigiRakshak, Please Login</Text>
      <Image source={require('../assets/spamsplash.png')} style={styles.image} />
      
      {/* PIN Display */}
      <View style={styles.pinContainer}>
        <Text style={styles.pinLabel}>Enter your 4-digit PIN</Text>
        <View style={styles.pinDotsContainer}>
          {Array.from({ length: 4 }, (_, index) => (
            <View
              key={index}
              style={[
                styles.pinDot,
                index < pin.length && styles.pinDotFilled,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Scrambled Keypad */}
      <ScrambledKeypad
        onKeyPress={(key) => {
          if (pin.length < 4) {
            setPin(prev => prev + key);
          }
        }}
        onBackspace={() => {
          setPin(prev => prev.slice(0, -1));
        }}
        onClear={() => setPin('')}
        showClearButton={true}
        maxLength={4}
        currentValue={pin}
        buttonColor="#fff"
        textColor="#2d3748"
        backgroundColor="#f7fafc"
        borderColor="#e2e8f0"
        enableVibration={false}
      />

      <View style={styles.row}>
        <TouchableOpacity onPress={handleForgot} style={styles.link}>
          <Text style={styles.linkText}>Forget Pin?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, pin.length < 4 && styles.disabled]}
          onPress={handleLogin}
          disabled={pin.length < 4}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
    loginsafe:{ flex: 1,
    backgroundColor: '#fff',},
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 20 },
  header: { marginTop: 60, textAlign: 'center', fontSize: 18, fontWeight: '600' },
  image: { width: 160, height: 160, alignSelf: 'center', marginVertical: 20 },
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
  row: { flexDirection: 'row', justifyContent: 'space-between', margin: 20 },
  link: { justifyContent: 'center' },
  linkText: { color: '#003366' },
  button: { backgroundColor: '#003366', padding: 12, borderRadius: 8 },
  disabled: { opacity: 0.6 },
  buttonText: { color: '#fff' },
});
