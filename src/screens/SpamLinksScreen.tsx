import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image ,StatusBar} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SpamLinksScreen = () => {
  return (
      <SafeAreaView style={styles.safe}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#003366"
            translucent={false}
          />
    <ScrollView style={styles.container}>
      <Text style={styles.header}> Beware of Spam Links</Text>

      <Image
        source={require('../assets/spamlinks.png')}
        style={styles.image}
      />

      <Text style={styles.title}>What are Spam Links?</Text>
      <Text style={styles.text}>
        Spam links are malicious URLs designed to redirect users to phishing websites, download malware, or collect sensitive information like passwords, OTPs, or banking credentials.
      </Text>

      <Text style={styles.title}> Dangers of Clicking Spam Links</Text>
      <Text style={styles.text}>
        • Credential theft{'\n'}
        • Identity fraud{'\n'}
        • Device infection with malware or spyware{'\n'}
        • Financial loss through fake login portals
      </Text>

      <Image
        source={require('../assets/s12.jpeg')}
        style={styles.image}
      />

      <Text style={styles.title}> Tips to Stay Safe</Text>
      <Text style={styles.text}>
         Avoid clicking on suspicious or shortened URLs (like bit.ly, tinyurl){'\n'}
         Hover over links to preview the real domain before clicking (on web){'\n'}
         Install browser extensions or tools that flag dangerous sites{'\n'}
         Double-check sender info in emails or SMS{'\n'}
         Always access websites by typing the official domain manually
      </Text>

      <Text style={styles.footer}>
        If you suspect a link is unsafe, avoid interacting with it and report it to your provider.
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
    backgroundColor: '#fffefeff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#002b5c',
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#003366',
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
    marginVertical: 12,
  },
  footer: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    marginTop: 25,
    textAlign: 'center',
  },
});

export default SpamLinksScreen;
