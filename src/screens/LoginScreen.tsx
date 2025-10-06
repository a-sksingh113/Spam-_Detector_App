import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to DigiRakshak, Please Login</Text>
      <Image source={require('../assets/spamsplash.png')} style={styles.image} />
      <TextInput
        style={styles.input}
        placeholder="Enter your 4-digit pin"
         placeholderTextColor="#999"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        value={pin}
        onChangeText={setPin}
      />
      <View style={styles.row}>
        <TouchableOpacity onPress={handleForgot} style={styles.link}>
          <Text style={styles.linkText}>Forget Pin?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={pin.length < 4}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
    loginsafe:{ flex: 1,
    backgroundColor: '#fff',},
  container: { flex: 1, backgroundColor: '#fff' },
  header: { marginTop: 60, textAlign: 'center', fontSize: 18, fontWeight: '600' },
  image: { width: 160, height: 160, alignSelf: 'center', marginVertical: 20 },
  input: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
     color: '#000',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', margin: 20 },
  link: { justifyContent: 'center' },
  linkText: { color: '#003366' },
  button: { backgroundColor: '#003366', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff' },
});
