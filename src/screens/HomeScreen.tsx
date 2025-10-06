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
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticateWithBiometrics } from '../utils/biometricAuth';
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
  const [userName, setUserName] = useState('User');
  const [currentTime, setCurrentTime] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleCardPress = (screen: string) => {
    navigation.navigate(screen as never);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const loadUserData = async () => {
    try {
      // Fetch real user name from AsyncStorage like ProfileScreen does
      const name = await AsyncStorage.getItem('name') || 'User';
      setUserName(name);
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const fetchBalance = async () => {
    try {
      setBalanceLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.log('User ID not found');
        return;
      }

      // Use same API call as CheckBalance page
      const response = await fetch(
        'https://api.ucohakethon.pixbit.me/api/tranction/check-balance',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setBalance(data.balance);
      } else {
        console.log('Balance fetch failed:', data.message);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setBalanceLoading(false);
    }
  };

  const handleRefreshBalance = () => {
    fetchBalance();
  };

  const toggleBalanceVisibility = () => {
    setBalanceHidden(!balanceHidden);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      loadUserData(),
      fetchBalance()
    ]);
    setRefreshing(false);
  };

  const handlePayWithAuthentication = async () => {
    try {
      console.log('Starting biometric authentication...');
      const authenticated = await authenticateWithBiometrics();
      console.log('Biometric authentication result:', authenticated);
      
      if (authenticated) {
        handleCardPress('PayScreen');
      }
    } catch (error: any) {
      console.log('Biometric authentication error:', error);
      
      Alert.alert(
        'Authentication Error',
        error.message || 'Biometric authentication failed. Please try again.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Try Again',
            onPress: handlePayWithAuthentication,
          },
          {
            text: 'Skip Authentication',
            onPress: () => handleCardPress('PayScreen'),
          },
        ]
      );
    }
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
    loadUserData();
    fetchBalance();
    
    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);
    
    return () => clearInterval(timeInterval);
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
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#667eea']}
            tintColor="#667eea"
          />
        }
      >
        {/* Modern Banking Header */}
        <View style={styles.modernHeader}>
          <View style={styles.headerTop}>
            <View style={styles.greetingSection}>
              <Text style={styles.greetingText}>{getGreeting()}</Text>
              <Text style={styles.userName}>{userName}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="notifications-outline" size={24} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => handleCardPress('Profile')}
              >
                <Ionicons name="person-circle-outline" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.timeText}>{currentTime}</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              {balanceLoading ? (
                <View style={styles.balanceLoadingContainer}>
                  <Text style={styles.balanceAmount}>₹ ••••••</Text>
                  <Text style={styles.loadingText}>Loading...</Text>
                </View>
              ) : (
                <Text style={styles.balanceAmount}>
                  {balanceHidden 
                    ? '₹ ••••••' 
                    : balance !== null 
                      ? `₹ ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(balance)}`
                      : '₹ 0.00'
                  }
                </Text>
              )}
            </View>
            <View style={styles.balanceActions}>
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={toggleBalanceVisibility}
              >
                <Ionicons 
                  name={balanceHidden ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#ffffff" 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={handleRefreshBalance}
                disabled={balanceLoading}
              >
                <Ionicons 
                  name="refresh-outline" 
                  size={20} 
                  color="#ffffff" 
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.balanceFooter}>
            <Text style={styles.accountNumber}>**** **** **** 1234</Text>
            <View style={styles.balanceBadge}>
              <Text style={styles.balanceBadgeText}>SECURE</Text>
            </View>
          </View>
        </View>
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={handlePayWithAuthentication}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#4CAF50' }]}>
              <Ionicons name="card-outline" size={24} color="#ffffff" />
            </View>
            <Text style={styles.quickActionText}>Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleCardPress('CheckBalance')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#2196F3' }]}>
              <Ionicons name="wallet-outline" size={24} color="#ffffff" />
            </View>
            <Text style={styles.quickActionText}>Balance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleCardPress('AllMessages')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FF9800' }]}>
              <Ionicons name="chatbubbles-outline" size={24} color="#ffffff" />
            </View>
            <Text style={styles.quickActionText}>Messages</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => handleCardPress('SpamMessages')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#F44336' }]}>
              <Ionicons name="shield-outline" size={24} color="#ffffff" />
            </View>
            <Text style={styles.quickActionText}>Spam</Text>
          </TouchableOpacity>
        </View>
        {/* Security Features Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Security Features</Text>
          <Text style={styles.sectionSubtitle}>Protect yourself from digital threats</Text>
        </View>

        <View style={styles.modernCardGrid}>
          {[
            {
              title: 'About Spam',
              subtitle: 'Learn spam identification',
              icon: 'information-circle-outline',
              screen: 'AboutSpam',
              gradient: ['#667eea', '#764ba2'],
            },
            {
              title: 'Bank Fraud',
              subtitle: 'Fraud protection tips',
              icon: 'shield-checkmark-outline',
              screen: 'BankFraud',
              gradient: ['#f093fb', '#f5576c'],
            },
            {
              title: 'Spam Links',
              subtitle: 'Detect & Block malicious links',
              icon: 'link-outline',
              screen: 'SpamLinks',
              gradient: ['#4facfe', '#00f2fe'],
            },
            {
              title: 'Malware Attacks',  
              subtitle: 'Protect from malware',
              icon: 'bug-outline',
              screen: 'Malware',
              gradient: ['#fa709a', '#fee140'],
            },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.modernCard}
              onPress={() => handleCardPress(item.screen)}
            >
              <View style={[styles.modernCardIcon, { backgroundColor: item.gradient[0] }]}>
                <Ionicons name={item.icon as any} size={28} color="#ffffff" />
              </View>
              <Text style={styles.modernCardTitle}>{item.title}</Text>
              <Text style={styles.modernCardSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Modern Info Banner */}
        <View style={styles.modernBanner}>
          <Image
            source={BANNERS[bannerIndex].image}
            style={styles.modernBannerImage}
          />
          <View style={styles.modernBannerOverlay}>
            <Text style={styles.modernBannerText}>{BANNERS[bannerIndex].label}</Text>
          </View>
        </View>

        {/* Security Tips Section */}
        <View style={styles.tipsSection}>
          <View style={styles.tipsSectionHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#667eea" />
            <Text style={styles.tipsSectionTitle}>Security Tips</Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="alert-circle-outline" size={20} color="#F44336" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Identify Spam Messages</Text>
              <Text style={styles.tipDescription}>
                Watch for unsolicited texts with suspicious links, urgent requests for personal info, or offers that seem too good to be true.
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="lock-closed-outline" size={20} color="#4CAF50" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Stay Protected</Text>
              <Text style={styles.tipDescription}>
                Never share personal or financial data via SMS. Use trusted apps to filter spam and report suspicious messages.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: { 
    backgroundColor: '#f8fafc',
  },
  // Modern Banking Header
  modernHeader: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  greetingSection: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  // Balance Card
  balanceCard: {
    backgroundColor: '#1a1a2e',
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '700',
    marginTop: 4,
  },
  eyeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountNumber: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  balanceBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  balanceBadgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  // Quick Actions
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  quickActionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  // Section Headers
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#1a1a2e',
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  // Modern Card Grid
  modernCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  modernCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'center',
  },
  modernCardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modernCardTitle: {
    fontSize: 16,
    color: '#1a1a2e',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  modernCardSubtitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  // Modern Banner
  modernBanner: {
    marginHorizontal: 20,
    borderRadius: 16,
    height: 120,
    marginBottom: 30,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  modernBannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modernBannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernBannerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  // Tips Section
  tipsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tipsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  tipsSectionTitle: {
    fontSize: 20,
    color: '#1a1a2e',
    fontWeight: '700',
    marginLeft: 12,
  },
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    color: '#1a1a2e',
    fontWeight: '600',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

});
