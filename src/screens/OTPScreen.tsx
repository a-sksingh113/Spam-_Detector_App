import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'OTP'>;

const OTPScreen: React.FC<Props> = ({ route, navigation }) => {
  const { phone } = route.params;
  const [otp, setOtp] = useState('');
const [verifying, setVerifying] = useState(false);


  const handleVerify = async () => {
    if (otp.length < 6) {
      Alert.alert('Error', 'OTP must be 6 digits');
      return;
    }

    try {
       setVerifying(true);
      const response = await fetch(
        'https://spam-detector-app-backend.vercel.app/api/user/verify-otp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ otp }),
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
    }finally {
      setVerifying(false);
    }
  };

  return (
    <SafeAreaView style={styles.Otpsafe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#003366"
        translucent={false}
      />
      <View style={styles.container}>
        <Text style={styles.header}>Verify OTP</Text>
        <Image
          source={require('../assets/spamsplash.png')}
          style={styles.image}
        />
        <Text style={styles.subheader}>OTP sent to {phone}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
        />
       <TouchableOpacity
  style={[styles.button, otp.length < 6 && styles.disabled]}
  onPress={handleVerify}
  disabled={verifying || otp.length < 6}
>
  {verifying ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Text style={styles.buttonText}>Verify</Text>
  )}
</TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  disabled: { opacity: 0.6 },
  Otpsafe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    marginTop: 60,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
  },
  subheader: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
  },
  image: { width: 180, height: 180, alignSelf: 'center', marginVertical: 20 },
  input: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#003366',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default OTPScreen;
