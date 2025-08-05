import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'LoginWithPhone'>;

const LoginWithPhoneScreen: React.FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!phone) {
      Alert.alert('Validation Error', 'Please enter your mobile number');
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      return;
    }
    try {
      setLoggingIn(true);
      const response = await fetch(
        'https://spam-detector-app-backend.vercel.app/api/user/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone }),
        },
      );

      const data = await response.json();

      if (data.success) {
        const user = data.user;

        // Store user fields in AsyncStorage
        await AsyncStorage.multiSet([
          ['userId', user._id],
          ['phone', user.phone],
          ['name', user.name],
          ['email', user.email],
          ['gender', user.gender],
          ['age', user.age],
          ['customerID', user.customerID],
          ['merchantID', user.merchantID],
        ]);

        navigation.replace('SetPin', { userId: user._id });
      } else {
        Alert.alert('Invalid OTP', 'Please check and try again.');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Please try again later.');
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#003366" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.header}>Login</Text>
            <Image
              source={require('../assets/spamsplash.png')}
              style={styles.image}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your mobile number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <TouchableOpacity
              style={[styles.button, (!phone || loggingIn) && styles.disabled]}
              onPress={handleLogin}
              disabled={!phone || loggingIn}
            >
              {loggingIn ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login with phone</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: { width: 150, height: 150, alignSelf: 'center', marginBottom: 30 },
  safe: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  header: {
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    color: '#003366',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
  },
  disabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default LoginWithPhoneScreen;
