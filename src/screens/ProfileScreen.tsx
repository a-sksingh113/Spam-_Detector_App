import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [profile, setProfile] = useState({
    name: 'Please Login',
    phone: 'Please Login',
    email: 'Please Login',
    gender: 'Please Login',
    age: 'Please Login',
    customerID: 'Please Login',
    merchantID: 'Please Login',
  });

  useEffect(() => {
    const fetchFromStorage = async () => {
      try {
        const [name, phone, email, gender, age, customerID, merchantID] =
          await Promise.all([
            AsyncStorage.getItem('name'),
            AsyncStorage.getItem('phone'),
            AsyncStorage.getItem('email'),
            AsyncStorage.getItem('gender'),
            AsyncStorage.getItem('age'),
            AsyncStorage.getItem('customerID'),
            AsyncStorage.getItem('merchantID'),
          ]);

        setProfile({
          name: name || 'Please Login',
          email: email || 'Please Login',
          phone: phone || 'Please Login',
          gender: gender || 'Please Login',
          age: age || 'Please Login',
          customerID: customerID || 'Please Login',
          merchantID: merchantID || 'Please Login',
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile from storage.');
      }
    };

    fetchFromStorage();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all user data from AsyncStorage
              await AsyncStorage.multiRemove([
                'userId',
                'name',
                'phone',
                'email',
                'gender',
                'age',
                'customerID',
                'merchantID',
                'isLoggedIn',
                'userToken',
              ]);
              
              // Navigate to login screen and reset navigation stack
              navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#667eea" />
      
      {/* Enhanced Header with gradient background */}
      <View style={styles.headerContainer}>
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-back" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>My Profile</Text>
              <Text style={styles.headerSubtitle}>Manage your account</Text>
            </View>
            
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={24} color="#fff" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>2</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Decorative elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../assets/profile-icon.png')}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          
          {/* Status Badge */}
          <View style={styles.statusBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
            <Text style={styles.statusText}>Verified Account</Text>
          </View>
        </View>

        {/* Personal Information Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="call" size={20} color="#667eea" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{profile.phone}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="person" size={20} color="#667eea" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{profile.gender}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar" size={20} color="#667eea" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{profile.age}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account Details Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Account Details</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="id-card" size={20} color="#667eea" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Customer ID</Text>
                <Text style={styles.infoValue}>{profile.customerID}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconContainer}>
                <Ionicons name="storefront" size={20} color="#667eea" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Merchant ID</Text>
                <Text style={styles.infoValue}>{profile.merchantID}</Text>
              </View>
            </View>
          </View>
        </View>

     

        {/* Footer spacing */}
        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
       flex: 1,
    backgroundColor: '#fff',

    marginBottom: 0
  },
  headerContainer: {
    height: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    backgroundColor: '#667eea',
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    height: 90,
  },
  headerLeft: {
    width: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff4757',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    top: 20,
    left: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexGrow: 1,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginTop: -50,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#667eea',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2d3748',
    marginBottom: 5,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 15,
    textAlign: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fff4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9ae6b4',
  },
  statusText: {
    fontSize: 14,
    color: '#2f855a',
    fontWeight: '600',
    marginLeft: 5,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 20,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f7fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '600',
  },
  actionContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fed7d7',
    shadowColor: '#ff4757',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minWidth: width * 0.6,
  },

  footer: {
    height: 10,
  },
});

export default ProfileScreen;
