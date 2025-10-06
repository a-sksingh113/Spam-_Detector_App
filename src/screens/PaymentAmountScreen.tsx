import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScrambledKeypad from '../components/ScrambledKeypad';

const PaymentAmountScreen = ({ navigation }: any) => {
  const [amount, setAmount] = useState('');
  const maxAmount = 1000000; // 10 lakh rupees
  const minAmount = 1;

  const handleKeyPress = (key: string) => {
    // Handle decimal point logic
    if (key === '.' && amount.includes('.')) return;
    
    // Limit decimal places to 2
    if (amount.includes('.')) {
      const decimalPart = amount.split('.')[1];
      if (decimalPart && decimalPart.length >= 2) return;
    }
    
    const newAmount = amount + key;
    const numericValue = parseFloat(newAmount);
    
    if (numericValue <= maxAmount) {
      setAmount(newAmount);
    }
  };

  const handleBackspace = () => {
    setAmount(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setAmount('');
  };

  const formatAmount = (value: string) => {
    if (!value) return '₹0';
    
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return '₹0';
    
    return `₹${numericValue.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleProceed = () => {
    const numericAmount = parseFloat(amount);
    
    if (!amount || numericAmount < minAmount) {
      Alert.alert('Error', `Minimum amount is ₹${minAmount}`);
      return;
    }
    
    if (numericAmount > maxAmount) {
      Alert.alert('Error', `Maximum amount is ₹${maxAmount.toLocaleString('en-IN')}`);
      return;
    }
    
    Alert.alert(
      'Confirm Payment',
      `Are you sure you want to pay ${formatAmount(amount)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Proceed',
          onPress: () => {
            // Navigate to PIN entry or payment confirmation
            Alert.alert('Success', 'Proceeding to payment...');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enter Amount</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Amount Display */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Amount to Pay</Text>
          <Text style={styles.amountDisplay}>
            {formatAmount(amount)}
          </Text>
          <Text style={styles.amountHint}>
            Min: ₹{minAmount} • Max: ₹{maxAmount.toLocaleString('en-IN')}
          </Text>
        </View>

        {/* Quick Amount Buttons */}
        <View style={styles.quickAmountSection}>
          <Text style={styles.sectionTitle}>Quick Amount</Text>
          <View style={styles.quickAmountGrid}>
            {[100, 500, 1000, 2000, 5000, 10000].map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickAmountButton}
                onPress={() => setAmount(quickAmount.toString())}
              >
                <Text style={styles.quickAmountText}>
                  ₹{quickAmount.toLocaleString('en-IN')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Scrambled Keypad */}
        <ScrambledKeypad
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onClear={handleClear}
          showClearButton={true}
          maxLength={10}
          currentValue={amount}
          buttonColor="#fff"
          textColor="#2d3748"
          backgroundColor="#f7fafc"
          borderColor="#e2e8f0"
        />

        {/* Proceed Button */}
        <TouchableOpacity
          style={[
            styles.proceedButton,
            amount && parseFloat(amount) >= minAmount 
              ? styles.proceedButtonActive 
              : styles.proceedButtonInactive
          ]}
          onPress={handleProceed}
          disabled={!amount || parseFloat(amount) < minAmount}
        >
          <Text style={[
            styles.proceedButtonText,
            amount && parseFloat(amount) >= minAmount 
              ? styles.proceedButtonTextActive 
              : styles.proceedButtonTextInactive
          ]}>
            Proceed to Pay
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={20} 
            color={amount && parseFloat(amount) >= minAmount ? '#fff' : '#a0aec0'} 
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#667eea',
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#f8fafc',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 8,
  },
  amountDisplay: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2d3748',
    marginBottom: 8,
  },
  amountHint: {
    fontSize: 14,
    color: '#a0aec0',
  },
  quickAmountSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 12,
  },
  quickAmountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickAmountButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: '30%',
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568',
  },
  proceedButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  proceedButtonActive: {
    backgroundColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  proceedButtonInactive: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  proceedButtonTextActive: {
    color: '#fff',
  },
  proceedButtonTextInactive: {
    color: '#a0aec0',
  },
});

export default PaymentAmountScreen;