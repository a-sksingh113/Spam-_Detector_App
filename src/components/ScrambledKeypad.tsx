import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Vibration,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface ScrambledKeypadProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onClear?: () => void;
  showClearButton?: boolean;
  buttonColor?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  maxLength?: number;
  currentValue?: string;
  enableVibration?: boolean;
}

const ScrambledKeypad: React.FC<ScrambledKeypadProps> = ({
  onKeyPress,
  onBackspace,
  onClear,
  showClearButton = false,
  buttonColor = '#fff',
  textColor = '#2d3748',
  backgroundColor = '#f7fafc',
  borderColor = '#e2e8f0',
  maxLength = 10,
  currentValue = '',
  enableVibration = false,
}) => {
  const [scrambledNumbers, setScrambledNumbers] = useState<number[]>([]);

  // Shuffle array function
  const shuffleArray = (array: number[]): number[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Initialize and scramble numbers on component mount
  useEffect(() => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    setScrambledNumbers(shuffleArray(numbers));
  }, []);

  // Re-scramble numbers every time the component is focused or after certain actions
  const rescrambleNumbers = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    setScrambledNumbers(shuffleArray(numbers));
  };

  // Safe vibration function that handles permissions gracefully
  const safeVibrate = (duration: number) => {
    if (!enableVibration) return;
    
    try {
      if (Platform.OS === 'ios') {
        // iOS doesn't require permission for vibration
        Vibration.vibrate(duration);
      } else {
        // Android - use a shorter, safer vibration
        Vibration.vibrate(duration);
      }
    } catch (error) {
      // Silently fail if vibration is not available or permission denied
      console.log('Vibration not available:', error);
    }
  };

  const handleKeyPress = (key: string) => {
    if (currentValue.length >= maxLength) return;
    
    // Safe haptic feedback (only if enabled)
    safeVibrate(30);
    
    onKeyPress(key);
    
    // Optionally rescramble after each key press for maximum security
    // setTimeout(() => rescrambleNumbers(), 200);
  };

  const handleBackspace = () => {
    // Safe haptic feedback (only if enabled)
    safeVibrate(30);
    onBackspace();
  };

  const handleClear = () => {
    // Safe haptic feedback (only if enabled)
    safeVibrate(50);
    if (onClear) onClear();
    rescrambleNumbers();
  };

  const renderKeypadButton = (value: string | number, isSpecial = false) => {
    const isNumber = typeof value === 'number';
    
    return (
      <TouchableOpacity
        key={value.toString()}
        style={[
          styles.keypadButton,
          {
            backgroundColor: isSpecial ? '#f1f5f9' : buttonColor,
            borderColor: isSpecial ? '#cbd5e1' : borderColor,
          },
          isSpecial && styles.specialButton,
        ]}
        onPress={() => {
          if (isNumber) {
            handleKeyPress(value.toString());
          } else if (value === 'backspace') {
            handleBackspace();
          } else if (value === 'clear') {
            handleClear();
          }
        }}
        activeOpacity={0.6}
      >
        {isNumber ? (
          <Text style={[styles.keypadButtonText, { color: textColor }]}>
            {value}
          </Text>
        ) : value === 'backspace' ? (
          <Ionicons name="backspace-outline" size={18} color="#64748b" />
        ) : value === 'clear' ? (
          <Text style={[styles.specialButtonText, { color: '#ef4444' }]}>
            CLR
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>

      {/* Keypad Grid */}
      <View style={styles.keypadContainer}>
        {/* First 3 rows of scrambled numbers */}
        {[0, 1, 2].map((rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {scrambledNumbers.slice(rowIndex * 3, (rowIndex + 1) * 3).map((number) =>
              renderKeypadButton(number)
            )}
          </View>
        ))}

        {/* Last row with remaining number and action buttons */}
        <View style={styles.keypadRow}>
          {showClearButton ? (
            renderKeypadButton('clear', true)
          ) : (
            <View style={{ width: (width * 0.85 - 32) / 3 }} />
          )}
          {scrambledNumbers[9] !== undefined && renderKeypadButton(scrambledNumbers[9])}
          {renderKeypadButton('backspace', true)}
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  keypadContainer: {
    alignItems: 'center',
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 6,
    width: width * 0.85,
    paddingHorizontal: 4,
  },
  keypadButton: {
    width: (width * 0.85 - 32) / 3,
    height: 44,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 0.5,
  },
  specialButton: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },
  keypadButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1f2937',
    letterSpacing: 0.5,
  },
  specialButtonText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
  },
});

export default ScrambledKeypad;