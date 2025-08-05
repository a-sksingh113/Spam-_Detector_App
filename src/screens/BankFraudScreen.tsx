import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image,StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BankFraudScreen = () => {
  return (
      <SafeAreaView style={styles.safe}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#003366"
            translucent={false}
          />
    <ScrollView style={styles.container}>
      <Text style={styles.header}> Bank Fraud Awareness</Text>

      <Image source={require('../assets/s21.jpg')} style={styles.image} />

      <Text style={styles.title}>What is Bank Fraud?</Text>
      <Text style={styles.text}>
        Bank fraud involves deception to steal sensitive financial data or money from individuals.
        Fraudsters pretend to be officials or banking systems via SMS, email, or calls.
      </Text>

      <Text style={styles.title}> Common Types of Bank Fraud</Text>
      <Text style={styles.text}>
        • Phishing Emails & SMS{'\n'}
        • Fake Banking Apps{'\n'}
        • OTP and PIN Scams{'\n'}
        • Social Engineering Attacks
      </Text>

      <Image source={require('../assets/s23.png')} style={styles.image} />

      <Text style={styles.title}> How to Identify Phishing</Text>
      <Text style={styles.text}>
        • Look for spelling errors & suspicious domains{'\n'}
        • Avoid clicking links from unverified numbers{'\n'}
        • Never share OTPs or PINs with anyone, even if they claim to be from the bank{'\n'}
        • Use official banking apps only
      </Text>

      <Image source={require('../assets/s22.jpg')} style={styles.image} />

      <Text style={styles.title}> Tips to Stay Safe</Text>
      <Text style={styles.text}>
         Enable 2-Factor Authentication (2FA){'\n'}
         Use strong and unique passwords for banking apps{'\n'}
         Keep your mobile number and email updated with your bank{'\n'}
         Check account alerts regularly
      </Text>

      <Text style={styles.disclaimer}>
        If you suspect any fraudulent activity, immediately contact your bank’s official helpline.
      </Text>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    marginTop: 10,
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    backgroundColor: '#f5faff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#002244',
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    color: '#333333',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
    marginVertical: 12,
  },
  disclaimer: {
    fontSize: 14,
    marginTop: 25,
    fontStyle: 'italic',
    color: '#555',
    textAlign: 'center',
  },
});

export default BankFraudScreen;
