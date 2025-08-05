import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Linking,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';

interface SpamLinkItem {
  url: string;
  status: string;
  sender?: string;
  timestamp: string;
}

const SpamLinks = () => {
  const [spamLinks, setSpamLinks] = useState<SpamLinkItem[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSpamLinks();
  }, []);

  const fetchSpamLinks = async () => {
    try {
      const data = await AsyncStorage.getItem('linkHistory');
      if (data) {
        const parsed = JSON.parse(data) as SpamLinkItem[];
        const filtered = parsed.filter((item) => item.status === 'spam');
        setSpamLinks(filtered);
      }
    } catch (error) {
      console.error('Error fetching spam links:', error);
    }
  };

  const toggleSelection = (url: string) => {
    setSelectedLinks((prev) => {
      const newSet = new Set(prev);
      newSet.has(url) ? newSet.delete(url) : newSet.add(url);
      return newSet;
    });
  };

  const deleteSelectedLinks = async () => {
    Alert.alert(
      'Delete Links?',
      'Are you sure you want to delete the selected links?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const existing = await AsyncStorage.getItem('linkHistory');
              if (!existing) return;

              const allLinks: SpamLinkItem[] = JSON.parse(existing);
              const filtered = allLinks.filter(
                (item) => !(item.status === 'spam' && selectedLinks.has(item.url))
              );

              await AsyncStorage.setItem('linkHistory', JSON.stringify(filtered));
              setSelectedLinks(new Set());
              fetchSpamLinks();
            } catch (error) {
              console.error('Error deleting links:', error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: SpamLinkItem }) => {
    const isSelected = selectedLinks.has(item.url);
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => toggleSelection(item.url)}
        onLongPress={() => Linking.openURL(item.url)}
      >
        <Text style={styles.link}>⚠️{item.url}</Text>
        <Text style={styles.type}>Type: SPAM</Text>
        {item.sender && <Text style={styles.sender}>Sender: {item.sender}</Text>}
        <Text style={styles.timestamp}>
          Detected: {new Date(item.timestamp).toLocaleString()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f1f2f4ff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Spam Links</Text>
        <View style={styles.rightIcons}>
          <Feather name="search" size={22} color="#010101ff" style={{ marginRight: 20 }} />
          <Image
            source={require('../assets/profile-icon.png')}
            style={styles.profileIcon}
          />
        </View>
      </View>

      {/* Delete Button */}
      {selectedLinks.size > 0 && (
        <View style={styles.deleteContainer}>
          <Button title="🗑️ Delete Selected" color="red" onPress={deleteSelectedLinks} />
        </View>
      )}

      {/* Content */}
      <View style={styles.container}>
        <FlatList
          data={spamLinks}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.timestamp || index.toString()}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 30 }}>No spam links found.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default SpamLinks;

const styles = StyleSheet.create({
  safe: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#fbfbfcff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000000ff',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  card: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  cardSelected: {
    backgroundColor: '#ffeaea',
    borderColor: 'red',
    borderWidth: 1,
  },
  link: {
    fontSize: 14,
    color: '#007bff',
    marginBottom: 5,
  },
  type: {
    fontSize: 12,
    color: 'red',
  },
  sender: {
    fontSize: 12,
    color: '#555',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
  },
  deleteContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
});
