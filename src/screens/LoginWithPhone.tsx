import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  View,
  Dimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'LoginWithPhone'>;

const LoginWithPhoneScreen: React.FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!phone) {
      Alert.alert('Validation Error', 'Please enter your mobile number');
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      return;
    }
    try {
      setLoggingIn(true);
      const response = await fetch(
        'https://api.ucohakethon.pixbit.me/api/user/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone }),
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
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#667eea" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="log-in-outline" size={28} color="#fff" />
          <Text style={styles.headerTitle}>Welcome Back</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollRef}
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <Image
                source={require('../assets/spamsplash.png')}
                style={styles.logo}
              />
              <Text style={styles.welcomeTitle}>Sign In to DigiRakshak</Text>
              <Text style={styles.welcomeSubtitle}>
                Enter your mobile number to access your secure account
              </Text>
            </View>

            {/* Login Form Card */}
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Mobile Number</Text>
              
              {/* Phone Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={20} color="#667eea" style={styles.inputIcon} />
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your mobile number"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    maxLength={10}
                  />
                </View>
                <Text style={styles.helpText}>
                  We'll send an OTP to verify your number
                </Text>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  (!phone || loggingIn || phone.length < 10) && styles.loginButtonDisabled
                ]}
                onPress={handleLogin}
                disabled={!phone || loggingIn || phone.length < 10}
              >
                {loggingIn ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="shield-checkmark" size={20} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.loginButtonText}>Continue Securely</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Register Link */}
              <TouchableOpacity
                style={styles.registerContainer}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.registerText}>
                  Don't have an account? 
                </Text>
                <Text style={styles.registerLink}> Create Account</Text>
              </TouchableOpacity>
            </View>

            {/* Security Features */}
            <View style={styles.securitySection}>
              <Text style={styles.securityTitle}>Why DigiRakshak?</Text>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Ionicons name="shield-checkmark" size={20} color="#10b981" />
                  <Text style={styles.featureText}>Advanced spam detection</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="lock-closed" size={20} color="#10b981" />
                  <Text style={styles.featureText}>Secure payment protection</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="eye-off" size={20} color="#10b981" />
                  <Text style={styles.featureText}>Privacy-first approach</Text>
                </View>
              </View>
            </View>

            {/* Security Note */}
            <View style={styles.securityNote}>
              <Ionicons name="information-circle-outline" size={16} color="#64748b" />
              <Text style={styles.securityNoteText}>
                Your data is encrypted and protected with bank-level security
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    marginTop: 31,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#667eea',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
  },
  headerSpacer: {
    width: 40,
  },
  
  // Scroll Container
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  
  // Welcome Section
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    marginTop: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  
  // Form Card
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  
  // Input Styles
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 8,
  },
  inputIcon: {
    marginRight: 12,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  helpText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  
  // Login Button
  loginButton: {
    backgroundColor: '#667eea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#94a3b8',
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonIcon: {
    marginRight: 8,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  
  // Register Link
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  registerText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  registerLink: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  
  // Security Section
  securitySection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 12,
    fontWeight: '500',
  },
  
  // Security Note
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  securityNoteText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 6,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default LoginWithPhoneScreen;
