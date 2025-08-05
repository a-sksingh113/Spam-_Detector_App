import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
  DeviceEventEmitter,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SmsAndroid from 'react-native-get-sms-android';
import SmsListener from 'react-native-android-sms-listener';

type SmsMessage = {
  id: string;
  sender: string;
  content: string;
  time: string;
  date: number;
};

type ThreadSummary = {
  sender: string;
  content: string;
  time: string;
  date: number;
};

const AllMessages: React.FC = () => {
  const navigation = useNavigation<any>();
  const [allMessages, setAllMessages] = useState<SmsMessage[]>([]);
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [spamMessages, setSpamMessages] = useState<SmsMessage[]>([]);

  const inputRef = useRef<TextInput>(null);

  const reloadInbox = () => {
    SmsAndroid.list(
      JSON.stringify({ box: 'inbox', maxCount: 100 }),
      (err: string) => console.error('Failed to reload SMS:', err),
      (_count: string, smsList: string) => {
        try {
          const parsed: {
            _id?: string;
            date: number;
            address: string;
            body: string;
          }[] = JSON.parse(smsList);
          parsed.sort((a, b) => b.date - a.date);
          const messages: SmsMessage[] = parsed.map(msg => ({
            id: String(msg._id ?? msg.date),
            sender: msg.address,
            content: msg.body,
            time: new Date(msg.date).toLocaleTimeString(),
            date: msg.date,
          }));
          setAllMessages(messages);
        } catch (e) {
          console.error('Error parsing SMS list:', e);
        }
      },
    );
  };

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    let lastFetchDate = 0;
    const recentBodies = new Set<string>();
    let subscription: { remove: () => void } | null = null;

    const init = async (): Promise<void> => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        ]);
        const ok: boolean =
          granted['android.permission.READ_SMS'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.RECEIVE_SMS'] ===
            PermissionsAndroid.RESULTS.GRANTED;
        if (!ok) {
          Alert.alert(
            'Permission Required',
            'SMS permissions are needed to detect messages.',
            [{ text: 'Open Settings', onPress: () => Linking.openSettings() }],
            { cancelable: false },
          );
          return;
        }

        SmsAndroid.list(
          JSON.stringify({ box: 'inbox', maxCount: 100 }),
          (err: string) => console.error('Failed to load SMS:', err),
          (_count: string, smsList: string) => {
            try {
              const parsed: {
                _id?: string;
                date: number;
                address: string;
                body: string;
              }[] = JSON.parse(smsList);
              parsed.sort((a, b) => b.date - a.date);
              if (parsed.length) lastFetchDate = parsed[0].date;
              const messages: SmsMessage[] = parsed.map(msg => ({
                id: String(msg._id ?? msg.date),
                sender: msg.address,
                content: msg.body,
                time: new Date(msg.date).toLocaleTimeString(),
                date: msg.date,
              }));
              setAllMessages(messages);
            } catch (parseError: any) {
              console.error('Error parsing SMS list:', parseError);
            }
          },
        );

        subscription = SmsListener.addListener((message: any) => {
          try {
            if (!message.body || !message.originatingAddress || !message.date)
              return;
            const msgDate: number =
              typeof message.date === 'string'
                ? parseInt(message.date, 10)
                : message.date;
            if (msgDate <= lastFetchDate) return;
            if (recentBodies.has(message.body)) return;
            lastFetchDate = msgDate;
            recentBodies.add(message.body);
            setTimeout(() => recentBodies.delete(message.body), 10000);
            const newMsg: SmsMessage = {
              id: String(message._id ?? msgDate),
              sender: message.originatingAddress,
              content: message.body,
              time: new Date(msgDate).toLocaleTimeString(),
              date: msgDate,
            };
            setAllMessages(prev => [newMsg, ...prev]);
          } catch (listenerError: any) {
            console.error('Error in SMS listener:', listenerError);
          }
        });
      } catch (initError: any) {
        console.error('Initialization error:', initError);
      }
    };

    init();
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('SMS_REFRESH', () => {
      console.log('Native told us to refresh inbox');
      reloadInbox();
    });
    return () => sub.remove();
  }, []);

  const threadMap = new Map<string, ThreadSummary>();
  allMessages.forEach(msg => {
    const existing = threadMap.get(msg.sender);
    if (!existing || msg.date > existing.date) {
      threadMap.set(msg.sender, {
        sender: msg.sender,
        content: msg.content,
        time: msg.time,
        date: msg.date,
      });
    }
  });
  const threadSummaries: ThreadSummary[] = Array.from(threadMap.values()).sort(
    (a, b) => b.date - a.date,
  );

  const filteredThreads = searchText
    ? threadSummaries.filter(t =>
        t.sender.toLowerCase().includes(searchText.toLowerCase()),
      )
    : threadSummaries;

  const renderItem = ({ item }: { item: ThreadSummary }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('MessageDetails', {
          sender: item.sender,
          thread: allMessages.filter(m => m.sender === item.sender),
        })
      }
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image
            source={require('../assets/profile-icon.png')}
            style={styles.messageProfileIcon}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text numberOfLines={1}>{item.content}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const toggleSearch = () => {
    setSearchMode(v => !v);
    setSearchText('');
    setTimeout(() => inputRef.current?.focus(), 300);
  };



  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#003366" />

      <View style={styles.headerContainer}>
        {searchMode ? (
          <TextInput
            ref={inputRef}
            placeholder="Search by sender..."
            value={searchText}
            onChangeText={setSearchText}
            style={[
              styles.searchInput,
              { flex: 1, marginBottom: 0, marginTop: 4 },
            ]}
          />
        ) : (
          <Text style={styles.headerTitle}>All Messages</Text>
        )}
        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
            <Icon
              name={searchMode ? 'close' : 'search'}
              size={24}
              color="#003366"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.iconButton}
          >
            <Image
              source={require('../assets/profile-icon.png')}
              style={styles.profileIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {searchMode && searchText.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 16, color: '#777' }}>
          Type to search messages
        </Text>
      ) : (
        <FlatList
          data={searchMode ? filteredThreads : threadSummaries}
          keyExtractor={item => item.sender}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
};

export default AllMessages;

const styles = StyleSheet.create({
  profileIcon: {
    width: 40,
    height: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom:20,
    backgroundColor:'#fff'
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
  },
  iconButton: {
    marginLeft: 15,
  },
  safe: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 43,
    marginBottom:43
  },
  msgCard: {
    padding: 5,
    borderBottomWidth: 0,
    borderColor: '#ffffff',
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  card: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    margin:1
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  messageProfileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  sender: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    margin: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
