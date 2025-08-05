
import React, { useState } from 'react'; 
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Linking,
  Alert,
  TouchableOpacity
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


type ThreadItem = {
  id: string;
  sender: string;
  content: string;
  time: string;
  date: number;
};

type LinkHistoryItem = {
  url: string;
  status: 'spam' | 'safe';
  timestamp: string;
};

type MessageDetailsRouteProp = RouteProp<
  Record<string, { sender: string; thread: ThreadItem[] }>,
  string
>;

const MessageDetails: React.FC = () => {
  const route = useRoute<MessageDetailsRouteProp>();
  const { sender, thread } = route.params;
  const [clickedUrl, setClickedUrl] = useState<string | null>(null);

  // Regex to find URLs
  const urlRegex =
    /(https?:\/\/[^\s]+)/g;



const checkLinkSpam = async (url: string) => {
  console.log('Link pressed:', url);

  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    console.log('Invalid URL format');
    Alert.alert('Invalid URL', 'Please provide a valid link.');
    return;
  }

  try {
    console.log('Sending POST request to backend...');
    const response = await fetch('https://model4.satishdev.me/predict4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    console.log('Response received. Status:', response.status);

    if (!response.ok) {
      console.error('Server returned error status:', response.status);
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Response JSON:', result);

    const storedLink: LinkHistoryItem = {
      url,
      status: result.prediction === 1 ? 'spam' : 'safe',
      timestamp: new Date().toISOString(),
    };

    const existing = await AsyncStorage.getItem('linkHistory');
    let updated: LinkHistoryItem[] = existing ? JSON.parse(existing) : [];

    const isDuplicate = updated.some((item: LinkHistoryItem) => item.url === url);
    if (!isDuplicate) {
      updated.unshift(storedLink);
      await AsyncStorage.setItem('linkHistory', JSON.stringify(updated));
      console.log('Link stored in AsyncStorage');
    } else {
      console.log('Link already exists in storage, not adding again.');
    }

    if (result.prediction === 1) {
      Alert.alert(
        '⚠️ Dangerous Link Detected!',
        'This link is flagged as SPAM. It may try to steal your personal or financial information.\n\nAre you sure you want to proceed?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Anyway', style: 'destructive', onPress: () => Linking.openURL(url) },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert(
        'Open Link?',
        'This link appears safe. Do you want to open it?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open', onPress: () => Linking.openURL(url) },
        ],
        { cancelable: true }
      );
    }

  } catch (error) {
    console.error('Error during spam check:', error);
    Alert.alert('Error', 'Could not check the link. Please try again later.');
  }
};



 const renderContentWithLinks = (text: string) => {
  const parts = text.split(urlRegex);
  return (
    <Text style={styles.content}>
      {parts.map((part, index) => {
        if (urlRegex.test(part)) {
          const isClicked = clickedUrl === part;
          return (
            <TouchableOpacity
              key={index}
              onPress={async () => {
                setClickedUrl(part); 
                await checkLinkSpam(part);
                setTimeout(() => setClickedUrl(null), 200); 
              }}
            >
              <Text   
                style={[
                  styles.link,
                  isClicked && styles.linkClicked, 
                ]}
              >
                {part}
              </Text>
            </TouchableOpacity>
          );
        }
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};

  const renderMsg = ({ item }: { item: ThreadItem }) => (
    <View style={styles.msgCard}>
      <Text style={styles.time}>{item.time}</Text>
      <Text style={styles.content}>{renderContentWithLinks(item.content)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/profile-icon.png')}
          style={styles.profileIcon}
        />
        <Text style={styles.headerTitle}>{sender}</Text>
      </View>
      <FlatList
        data={thread}
        keyExtractor={(item) => item.id}
        renderItem={renderMsg}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

export default MessageDetails;

const styles = StyleSheet.create({
  linkClicked: {
  opacity: 0.5, // or backgroundColor: '#ddd', or any style you want to indicate click
},

  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 35,
    marginBottom: 45,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#003366',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  msgCard: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
  link: {
    fontSize: 16,
    color: '#1a73e8',
    textDecorationLine: 'underline',
  },
});
