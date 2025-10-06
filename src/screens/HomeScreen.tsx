import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

const BANNERS = [
  {
    image: require('../assets/p3.png'),
    label: 'Protect Your Inbox',
  },
  {
    image: require('../assets/p1.png'),
    label: 'Block Spam Links',
  },
  {
    image: require('../assets/p2.png'),
    label: 'Stay Safe & Secure',
  },
];
const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const [bannerIndex, setBannerIndex] = useState(0);

  const handleCardPress = (screen: string) => {
    navigation.navigate(screen as never);
  };

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ]);

      const hasAllPermissions =
        granted['android.permission.RECEIVE_SMS'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_SMS'] ===
          PermissionsAndroid.RESULTS.GRANTED;

      if (!hasAllPermissions) {
        Alert.alert(
          'Permission Required',
          'This app needs SMS permissions to detect spam messages.',
          [
            {
              text: 'OK',
              onPress: () => {},
            },
          ],
          { cancelable: false },
        );
      }
    } catch (error) {
      console.warn('Permission request failed:', error);
    }
  };

  useEffect(() => {
    console.log('🔔 Running permission request');
    requestPermissions();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setBannerIndex(i => (i + 1) % BANNERS.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
  <StatusBar barStyle="dark-content" backgroundColor="#667eea" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Stay Safe from Spam - Instantly</Text>
        </View>
        <View style={styles.heroWrapper}>
          <Image
            source={require('../assets/spamhero.png')}
            style={styles.hero}
          />
          <View style={styles.heroLabel}>
            <Text style={styles.heroLabelText}>
              Your Security, Our Priority
            </Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => handleCardPress('AllMessages')}
          >
            <View>
              <Image
                source={require('../assets/messages.png')}
                style={styles.icons_tab}
              />
            </View>
            <Text>All Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => handleCardPress('SpamMessages')}
          >
            <View>
              <Image
                source={require('../assets/spamMessages.png')}
                style={styles.icons_tab}
              />
            </View>
            <Text>Spam Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => handleCardPress('AboutSpamLinks')}
          >
            <View>
              <Image
                source={require('../assets/spamlinks.png')}
                style={styles.icons_tab}
              />
            </View>
            <Text>Spam Links</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardGrid}>
          {[
            {
              title: 'About Spam',
              subtitle: 'Loan EMI, Electricity, Rent',
              icon: require('../assets/aboutspam.png'),
              screen: 'AboutSpam',
            },
            {
              title: 'Bank Fraud',
              subtitle: 'Loan EMI, Electricity, Rent',
              icon: require('../assets/bankfraud.png'),
              screen: 'BankFraud',
            },
            {
              title: 'Spam Links',
              subtitle: 'Detect & Block',
              icon: require('../assets/links.jpeg'),
              screen: 'SpamLinks',
            },
            {
              title: 'Malware Attacks',
              subtitle: 'App & File Scans',
              icon: require('../assets/malware.png'),
              screen: 'Malware',
            },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.card}
              onPress={() => handleCardPress(item.screen)}
            >
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
              <Image source={item.icon} style={styles.cardIcon} />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.statsRowPay}>
          <TouchableOpacity
            style={styles.statBox}
            onPress={async () => {
              try {
                const { authenticateWithBiometrics } = await import(
                  '../utils/biometricAuth'
                );
                const authenticated = await authenticateWithBiometrics();
                if (authenticated) {
                  handleCardPress('PayScreen');
                }
              } catch (error: any) {
                Alert.alert(
                  'Authentication Error',
                  error.message || 'Try again',
                );
              }
            }}
          >
            <View>
              <Image
                source={require('../assets/pay.png')}
                style={styles.icons_tab}
              />
            </View>
            <Text>Pay</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => handleCardPress('CheckBalance')}
          >
            <View>
              <Image
                source={require('../assets/checkbalance.png')}
                style={styles.icons_tab}
              />
            </View>
            <Text>Check balance</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bannerWrapper}>
          <Image
            source={BANNERS[bannerIndex].image}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>{BANNERS[bannerIndex].label}</Text>
          </View>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.faqQuestion}>What is a spam message?</Text>
          <Text style={styles.faqAnswer}>
            A spam message is an unsolicited or unwanted text, often sent in
            bulk for advertising, phishing, or spreading malware. It typically
            comes from unknown senders and may include suspicious links or
            requests for personal information.
          </Text>

          <Text style={[styles.faqQuestion, { marginTop: 20 }]}>
            How can you protect yourself?
          </Text>
          <Text style={styles.faqAnswer}>
            • Do not click on links from unknown numbers{'\n'}• Never share
            personal or financial data via SMS{'\n'}• Use a trusted
            SMS‐filtering app to block spam{'\n'}• Report spam messages to your
            carrier or use built‐in report tools
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: { backgroundColor: '#fff' },
  header: {
    fontSize: 20,
    fontWeight: '600',
    width: '100%',
    height: 40,
    backgroundColor: '#151532',
  },
  // iconsView: {
  //   backgroundColor: '#9293c8ff',
  //   padding: 15,
  //   borderRadius: 50,

  // },
  icons_tab: {
    position: 'relative',
    width: 40,
    height: 40,
    borderEndEndRadius: '30',
    color: '#f9f9f9ff',
  },
  headerText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 14,
    justifyContent: 'center',
    marginTop: 8,
  },
  heroWrapper: {
    width: 400,
    height: 350,
    position: 'relative',
  },
  hero: {
    backgroundColor: '#15066bff',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  heroLabel: {
    position: 'absolute',
    bottom: 100,
    left: 200,
    backgroundColor: '#15066bff', // blue
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },
  heroLabelText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  statsRowPay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },

  statBox: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: '50%',
  },
  buttonGrid: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
  },
  gridButton: {
    width: '45%',
    padding: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  cardGrid: {
    flexDirection: 'row',

    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: 90,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#ccc',
    fontSize: 12,
  },
  cardIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 48,
    height: 48,
    resizeMode: 'contain',
    opacity: 0.9,
  },
  bannerWrapper: {
    borderRadius: 13,
    width: '95%',
    height: 65,
    marginTop: 10,
    position: 'relative',
  },
  bannerImage: {
    borderRadius: 13,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    borderRadius: 13,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 51, 102, 0.4)',
  },
  bannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  faqSection: {
    width: '90%',
    marginTop: 30,
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#151532',
  },
  faqAnswer: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
});
