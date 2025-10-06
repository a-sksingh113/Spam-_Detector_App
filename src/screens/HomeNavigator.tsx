import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from './HomeScreen';
import ChatbotScreen from './ChatbotScreen';
import ProfileScreen from './ProfileScreen';

import AboutSpamScreen from './AboutSpamScreen';
import BankFraudScreen from './BankFraudScreen';
import MalwareScreen from './MalwareScreen';
import SpamLinksScreen from './SpamLinksScreen';
import AllMessages from './AllMessages';
import SpamMessages from './SpamMessages';
import SpamLinks from './SpamLinks';
import MessageDetails from './MessageDetails';
import checkBalance from './checkBalance';
import PayScreen from './PayScreen';
import PaymentHistory from './PaymentHistory';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const iconMap: Record<string, string> = {
  Home: 'home',
  Chatbot: 'chat',      
  Profile: 'person',
   History: 'history',
};

const BottomTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        const iconName = iconMap[route.name] || 'help-outline';
        return <MaterialIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#003366',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Chatbot" component={ChatbotScreen} />
    
<Tab.Screen name="PaymentHistory" component={PaymentHistory} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const HomeNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={BottomTabs} />
    <Stack.Screen name="AboutSpam" component={AboutSpamScreen} />
    <Stack.Screen name="BankFraud" component={BankFraudScreen} />
    <Stack.Screen name="Malware" component={MalwareScreen} />
    <Stack.Screen name="SpamLinks" component={SpamLinksScreen} />
    <Stack.Screen name="AllMessages" component={AllMessages} />
    <Stack.Screen name="SpamMessages" component={SpamMessages} />
    <Stack.Screen name="AboutSpamLinks" component={SpamLinks} />
    <Stack.Screen name="MessageDetails" component={MessageDetails} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="CheckBalance" component={checkBalance} />
    <Stack.Screen name="PayScreen" component={PayScreen} />

  </Stack.Navigator>
);

export default HomeNavigator;
