import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image,StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          navigation.replace('Login'); 
        } else {
          navigation.replace('Register');
        }
      } catch (error) {
        console.error('Error checking registration status:', error);
        navigation.replace('Register');
      }
    };

    const timer = setTimeout(checkRegistrationStatus, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe}>
          <StatusBar barStyle="dark-content" backgroundColor="#003366" />
    <View style={styles.container}>
      <Image source={require('../assets/spamsplash.png')} style={styles.logo} />
      <Text style={styles.title}>Digi Rakshak</Text>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
   safe: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 43,
    marginBottom:43
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
