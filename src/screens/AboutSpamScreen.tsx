import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image,StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AboutSpamScreen = () => {
  return (
      <SafeAreaView style={styles.safe}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#003366"
            translucent={false}
          />
    <ScrollView style={styles.container}>
      <Text style={styles.title}> What is a Spam Message?</Text>
      <Text style={styles.text}>
        Spam messages are unsolicited and unwanted communications sent via SMS or email. These are often sent in bulk by scammers or marketers and may contain:
      </Text>
      <Text style={styles.bullet}>• Advertising with no opt-out</Text>
      <Text style={styles.bullet}>• Phishing links that steal personal data</Text>
      <Text style={styles.bullet}>• Fake lottery or loan approvals</Text>

      <Image
        source={require('../assets/s11.jpg')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}> Categories of Spam</Text>
      <Text style={styles.text}>
        Spam messages come in various forms, including:
      </Text>
      <Text style={styles.bullet}>• Phishing Spam — fake bank login requests</Text>
      <Text style={styles.bullet}>• Promotional Spam — products/services without consent</Text>
      <Text style={styles.bullet}>• Financial Fraud — "get-rich" schemes, fake loans</Text>
      <Text style={styles.bullet}>• OTP Scams — disguised as bank verification messages</Text>

      <Image
        source={require('../assets/s12.jpeg')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}> How to Protect Yourself?</Text>
      <Text style={styles.bullet}> Avoid clicking links from unknown sources</Text>
      <Text style={styles.bullet}> Never share OTP or PIN with anyone</Text>
      <Text style={styles.bullet}> Use spam detection apps (like this one)</Text>
      <Text style={styles.bullet}> Enable banking alerts & multi-factor authentication</Text>
      <Text style={styles.bullet}> Report spam to your telecom provider</Text>

      <Text style={styles.title}> Why It Matters in Banking?</Text>
      <Text style={styles.text}>
        Most banking frauds start with spam messages. Scammers impersonate banks or payment apps. They send fake account alerts, fake offers, or urgent messages to trick users into sharing personal data.
      </Text>

      <Image
        source={require('../assets/s13.jpg')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.tip}> Tip: Always verify messages from your bank using their official app or helpline.</Text>
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
    backgroundColor: '#F3F8FC',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 10,
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 10,
  },
  bullet: {
    fontSize: 16,
    color: '#333',
    marginVertical: 2,
    paddingLeft: 10,
  },
  tip: {
    fontSize: 15,
    color: '#006600',
    marginTop: 15,
    fontStyle: 'italic',
  },
  image: {
    width: '100%',
    height: 180,
    marginVertical: 15,
    borderRadius: 10,
  },
});

export default AboutSpamScreen;
