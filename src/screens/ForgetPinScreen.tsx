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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SetPinScreen: React.FC = () => {


  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Text style={styles.header}>Change Your PIN</Text>

        <TextInput
          placeholder="Enter phone number"
           placeholderTextColor="#999"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          placeholder="Enter new PIN"
           placeholderTextColor="#999"
          style={styles.input}
          secureTextEntry
          keyboardType="numeric"
          value={pin}
          onChangeText={setPin}
        />
        <TextInput
          placeholder="Confirm new PIN"
           placeholderTextColor="#999"
          style={styles.input}
          secureTextEntry
          keyboardType="numeric"
          value={confirmPin}
          onChangeText={setConfirmPin}
        />

        <TouchableOpacity style={styles.button} onPress={handleSetPin}>
          <Text style={styles.buttonText}>Save PIN</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: {
    flex: 1,
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
  button: {
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default SetPinScreen;
