import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { ActivityIndicator } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [customerID, setCustomerID] = useState('');
  const [merchantID, setMerchantID] = useState('');
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const validateAndSendOTP = () => {
    if (
      !phone ||
      !name ||
      !email ||
      !gender ||
      !age ||
      !customerID ||
      !merchantID
    ) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      return;
    }
    handleSendOTP();
  };

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://api.ucohakethon.pixbit.me/api/user/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone,
            name,
            email,
            gender,
            age,
            customerID,
            merchantID,
          }),
        },
      );
      const data = await response.json();
      if (response.ok && data.success) {
        navigation.navigate('OTP', { phone });
      } else {
        Alert.alert('Registration Error', data.message || 'Failed to send OTP');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => navigation.replace('Home');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#003366" />
      <TouchableOpacity style={styles.skipOverlay} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

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
            <Text style={styles.header}>Register</Text>
            <Image
              source={require('../assets/spamsplash.png')}
              style={styles.image}
            />

            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
               placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <TextInput
              style={styles.input}
              placeholder="Name"
               placeholderTextColor="#999"
              keyboardType="default"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
               placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="male or female"
               placeholderTextColor="#999"
              keyboardType="default"
              value={gender}
              onChangeText={setGender}
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
               placeholderTextColor="#999"
              keyboardType="number-pad"
              value={age}
              onChangeText={setAge}
            />
            <TextInput
              style={styles.input}
              placeholder="Customer ID"
               placeholderTextColor="#999"
              keyboardType="default"
              value={customerID}
              onChangeText={setCustomerID}
            />
            <TextInput
              style={styles.input}
              placeholder="Merchant ID"
               placeholderTextColor="#999"
              keyboardType="default"
              value={merchantID}
              onChangeText={setMerchantID}
            />

            <TouchableOpacity
              style={[
                styles.button,
                !(phone && name && email) && styles.disabled,
              ]}
              onPress={validateAndSendOTP}
              disabled={loading} // prevent multiple taps
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('LoginWithPhone')}
            >
              <Text style={styles.loginText}>
                Already registered? <Text style={styles.loginLink}>Login</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
    fontSize: 14,
  },
  loginLink: {
    color: '#003366',
    fontWeight: '600',
  },

  safe: { marginTop: 30, flex: 1, backgroundColor: '#fff' },
  skipOverlay: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 10,
  },
  skipText: { fontSize: 16, color: '#003366' },
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 15 },
  header: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#003366',
    marginBottom: 30,
  },
  image: { width: 130, height: 130, alignSelf: 'center', marginBottom: 30 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 9,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  disabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default RegisterScreen;
