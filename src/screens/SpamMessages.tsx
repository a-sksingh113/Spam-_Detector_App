import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SmsMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

type ThreadSummary = {
  sender: string;
  content: string;
  timestamp: string;
};

const SpamMessages: React.FC = () => {
  const navigation = useNavigation<any>();
  const [spamMessages, setSpamMessages] = useState<SmsMessage[]>([]);
  const [grouped, setGrouped] = useState<ThreadSummary[]>([]);
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedSender, setSelectedSender] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  const groupMessages = (messages: SmsMessage[]): ThreadSummary[] => {
    const map = new Map<string, ThreadSummary>();
    for (const msg of messages) {
      const existing = map.get(msg.sender);
      if (!existing || new Date(msg.timestamp).getTime() > new Date(existing.timestamp).getTime()) {
        map.set(msg.sender, {
          sender: msg.sender,
          content: msg.content,
          timestamp: msg.timestamp,
        });
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  const loadSpamMessages = async () => {
    try {
      const raw = await AsyncStorage.getItem('spamMessages');
      const parsed: SmsMessage[] = raw ? JSON.parse(raw) : [];
      setSpamMessages(parsed);
      setGrouped(groupMessages(parsed));
    } catch (err) {
      console.error('Error loading spam messages:', err);
    }
  };

  useEffect(() => {
    loadSpamMessages();
    const sub = DeviceEventEmitter.addListener('SMS_REFRESH', loadSpamMessages);
    return () => sub.remove();
  }, []);

  const deleteSelectedThread = async () => {
    if (!selectedSender) return;

    const updatedMessages = spamMessages.filter(msg => msg.sender !== selectedSender);
    await AsyncStorage.setItem('spamMessages', JSON.stringify(updatedMessages));
    setSelectedSender(null);
    setSpamMessages(updatedMessages);
    setGrouped(groupMessages(updatedMessages));
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Thread',
      `Are you sure you want to delete all messages from "${selectedSender}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: deleteSelectedThread },
      ]
    );
  };

  const filteredThreads = searchText
    ? grouped.filter(msg =>
        msg.sender.toLowerCase().includes(searchText.toLowerCase()) ||
        msg.content.toLowerCase().includes(searchText.toLowerCase())
      )
    : grouped;

  const renderItem = ({ item }: { item: ThreadSummary }) => (
    <TouchableOpacity
      onPress={() => {
        if (selectedSender) return setSelectedSender(null); // deselect
        navigation.navigate('MessageDetails', {
          sender: item.sender,
          thread: spamMessages.filter(m => m.sender === item.sender),
        });
      }}
      onLongPress={() => setSelectedSender(item.sender)}
      style={[
        styles.card,
        selectedSender === item.sender && { backgroundColor: '#FFDDDD' },
      ]}
    >
      <View style={styles.cardHeader}>
        <Image
          source={require('../assets/profile-icon.png')}
          style={styles.messageProfileIcon}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.sender}>{item.sender} </Text>
          <Text numberOfLines={1}> ⚠️{item.content} </Text>
          <Text style={styles.time}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const toggleSearch = () => {
    setSearchMode(prev => !prev);
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
            placeholder="Search spam..."
             placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            style={[styles.searchInput, { flex: 1, marginBottom: 0, marginTop: 4 }]}
          />
        ) : (
          <Text style={styles.headerTitle}>Spam Messages</Text>
        )}

        <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
          <Icon name={searchMode ? 'close' : 'search'} size={24} color="#003366" />
        </TouchableOpacity>

        {selectedSender && (
          <TouchableOpacity onPress={confirmDelete} style={styles.iconButton}>
            <Icon name="delete" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>

      {grouped.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No spam messages found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredThreads}
          keyExtractor={(item) => item.sender}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
};

export default SpamMessages;

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
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
  },
  iconButton: {
    marginLeft: 10,
  },
  safe: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 43,
    marginBottom: 43,
  },
  card: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#ffffff',
    margin: 1,
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
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  searchInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    margin: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
});
