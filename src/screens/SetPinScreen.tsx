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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'SetPin'>;

const SetPinScreen: React.FC<Props> = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

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
    <View style={styles.container}>
      <Text style={styles.header}>Create PIN for SpamWatch</Text>
      <Image
        source={require('../assets/spamsplash.png')}
        style={styles.image}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter 4-digit pin"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        value={pin}
        onChangeText={setPin}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm PIN"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        value={confirm}
        onChangeText={setConfirm}
      />
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: pin.length === 4 && pin === confirm ? '#003366' : '#ccc' },
        ]}
        onPress={handleSetPin}
        disabled={pin.length !== 4 || pin !== confirm}
      >
        <Text style={styles.buttonText}>Set PIN</Text>
      </TouchableOpacity>
    </View>
     </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safe:{flex: 1, backgroundColor: '#fff'},
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    marginTop: 60,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  image: { width: 180, height: 180, alignSelf: 'center', marginVertical: 20 },
  input: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  button: {
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default SetPinScreen;
