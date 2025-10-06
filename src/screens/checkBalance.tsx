import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Animated,
  Easing
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CheckBalance = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<ScrollView>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateIcon = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 700,
          useNativeDriver: true,
          easing: Easing.ease
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
          easing: Easing.ease
        })
      ]),
      {
        iterations: 3,
      }
    ).start();
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) throw new Error('User ID not found');

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
        setBalance(data.balance);
        animateIcon();
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#003366" />

      <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
        {loading ? (
          <>
            <Text style={styles.title}>Checking Balance...</Text>
            <ActivityIndicator size='large' color="#0000ff" />
          </>
        ) : (
          <View style={styles.balanceContainer}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Ionicons name="checkmark-circle" size={60} color="#0A7" />
            </Animated.View>
            <Text style={styles.balanceSuccesLabel}>Balance check successful</Text>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceValue}>₹{balance}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckBalance;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 31,
    marginBottom: 43
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  balanceContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  balanceSuccesLabel: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0A7',
    marginTop: 10,
  },
});
