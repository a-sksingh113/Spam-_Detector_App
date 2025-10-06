import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  ImageBackground,
  StatusBar,
  Keyboard,
  KeyboardEvent,
  ScrollView as RNScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const CheckMessageScreen = () => {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<RNScrollView>(null);

  useFocusEffect(
    React.useCallback(() => {
      setResult(null);
      setMessage('');
    }, []),
  );

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100); // slight delay helps avoid layout race
    });

    return () => {
      showSubscription.remove();
    };
  }, []);

  const checkMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Validation Error', 'Please enter a message.');
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await fetch('https://model1.pixbit.me/predict1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      });

      console.log('HTTP status:', response.status);
      const data = await response.json();
      console.log('API response JSON:', data);

      const raw = data.prediction;
      const normalized = String(raw).toLowerCase();
      console.log('Normalized:', normalized);

      const isSpam = normalized === 'spam';
      setResult(isSpam ? 'spam' : 'ham');

      if (isSpam) {
        Alert.alert('⚠️ Spam Alert', 'This message is likely SPAM!');
      }

      setMessage('');
    } catch (error) {
      console.error('checkMessage error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/abstract.jpg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
        style={styles.flex}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <StatusBar barStyle="light-content" backgroundColor="#003366" />

          {result === null ? (
            <>
              <Text style={styles.title}>Check if Message is Spam</Text>

              <Image
                source={require('../assets/spamsplash.png')}
                style={styles.logo}
                resizeMode="contain"
              />

              <TextInput
                style={styles.input}
                placeholder="Paste your message here..."
                 placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={message}
                onChangeText={setMessage}
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={checkMessage}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Checking…' : 'Check Message'}
                </Text>
              </TouchableOpacity>

              {loading && (
                <ActivityIndicator style={styles.spinner} size="large" />
              )}
            </>
          ) : (
            <View
              style={[
                styles.resultBox,
                result === 'spam' ? styles.spam : styles.ham,
              ]}
            >
              <Text style={styles.resultText}>
                {result === 'spam'
                  ? '🚫 This message is SPAM'
                  : '✅ This message is SAFE'}
              </Text>

              <TouchableOpacity
                style={[styles.button, { marginTop: 20 }]}
                onPress={() => {
                  setResult(null);
                  setMessage('');
                }}
              >
                <Text style={styles.buttonText}>🔁 Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bg: { flex: 1 },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e9eceeff',
    textAlign: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginVertical: 40,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1.3,
    borderRadius: 6,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#004080',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#003366',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  spinner: { marginTop: 15 },
  resultBox: {
    marginTop: 200,
    justifyContent: 'center',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  spam: {
    backgroundColor: '#ffe6e6',
    borderColor: '#ff4d4d',
    borderWidth: 1,
  },
  ham: {
    backgroundColor: '#e6ffed',
    borderColor: '#33cc66',
    borderWidth: 1,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default CheckMessageScreen;
