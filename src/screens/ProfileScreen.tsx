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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
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

  const handleUpdateProfile = () => {
    Alert.alert('Coming Soon', 'Profile editing not implemented yet.');
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    Alert.alert('Logged out', 'You have been logged out.');
    // Optionally navigate to login screen
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#003366" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={require('../assets/profile-icon.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={20} color="#007AFF" />
            <Text style={styles.detailText}>Phone: {profile.phone}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={20} color="#007AFF" />
            <Text style={styles.detailText}>Gender: {profile.gender}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#007AFF" />
            <Text style={styles.detailText}>Age: {profile.age}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="id-card-outline" size={20} color="#007AFF" />
            <Text style={styles.detailText}>
              Customer ID: {profile.customerID}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="briefcase-outline" size={20} color="#007AFF" />
            <Text style={styles.detailText}>
              Merchant ID: {profile.merchantID}
            </Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          {/* <TouchableOpacity
            style={styles.editButton}
            onPress={handleUpdateProfile}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity> */}

          {/* <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    marginTop:35,
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    backgroundColor: '#f9fbff',
    flexGrow: 1,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003366',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  detailsContainer: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#003366',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#444',
  },
  actionContainer: {
    gap: 15,
  },
  // editButton: {
  //   flexDirection: 'row',
  //   backgroundColor: '#007AFF',
  //   paddingVertical: 14,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 10,
  //   gap: 10,
  // },
  // logoutButton: {
  //   flexDirection: 'row',
  //   backgroundColor: '#ff3b30',
  //   paddingVertical: 14,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 10,
  //   gap: 10,
  // },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProfileScreen;
