
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MessagesProvider } from './src/context/MessagesContext';


import SplashScreen from './src/screens/SplashScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import OTPScreen from './src/screens/OTPScreen';
import SetPinScreen from './src/screens/SetPinScreen';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPinScreen from './src/screens/ForgetPinScreen';
import HomeNavigator from './src/screens/HomeNavigator';
import { readAndCheckSMS } from './src/utils/readSMS';
import LoginWithPhoneScreen from './src/screens/LoginWithPhone';

export type RootStackParamList = {
  PayScreen:undefined;
  CheckBalance:undefined;
  LoginWithPhone: undefined;
  Splash: undefined;
  Register: undefined;
  OTP: { phone: string;  }; 
  SetPin: { userId: string };
  Login: undefined;
  ForgotPin: undefined;
  Home: undefined;
  Profile: undefined;
 
};

const Stack = createNativeStackNavigator<RootStackParamList>();



const App = () =>
  {
      useEffect(() => {
    readAndCheckSMS(); 
  }, []);
  
  return(
     <MessagesProvider>
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="SetPin" component={SetPinScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPin" component={ForgotPinScreen} />
      <Stack.Screen name="Home" component={HomeNavigator} />
      <Stack.Screen name="LoginWithPhone" component={LoginWithPhoneScreen} />


    </Stack.Navigator>
  </NavigationContainer>
  </MessagesProvider>
);
}

export default App;