import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type Transaction = {
  name: string;
  merchantID: string;
  amount: number;
  date: string;
  type: 'sent' | 'received';
};

const PaymentHistory = () => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        Alert.alert('Please login first');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        'https://spam-detector-app-backend.vercel.app/api/tranction/transactions-history',
        { userId }
      );

      if (response.data.success) {
        const sent = response.data.sentTransactions.map((item: any) => ({
          ...item,
          type: 'sent',
        }));
        const received = response.data.receivedTransactions.map((item: any) => ({
          ...item,
          type: 'received',
        }));
        const merged = [...sent, ...received].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setAllTransactions(merged);
      } else {
        Alert.alert('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>MerchantID: {item.merchantID}</Text>
      <Text>Amount: ₹{item.amount}</Text>
      <Text>Date: {new Date(item.date).toLocaleString()}</Text>
      <Text style={item.type === 'sent' ? styles.sent : styles.received}>
        {item.type === 'sent' ? '→ Sent' : '← Received'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#003366" />
      <Text style={styles.title}>Transaction History</Text>
      <FlatList
        data={allTransactions}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No transactions found.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 35, flex: 1, padding: 16, backgroundColor: '#fff' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  item: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
  },
  name: { fontWeight: 'bold', fontSize: 16 },
  sent: { color: 'red', fontWeight: 'bold', marginTop: 5 },
  received: { color: 'green', fontWeight: 'bold', marginTop: 5 },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaymentHistory;
