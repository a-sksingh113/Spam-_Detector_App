import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  StatusBar, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const AboutSpamScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#667eea" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="shield-outline" size={28} color="#fff" />
          <Text style={styles.headerTitle}>About Spam Protection</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <Ionicons name="warning" size={32} color="#ef4444" />
          </View>
          <Text style={styles.heroTitle}>Stay Safe from Spam</Text>
          <Text style={styles.heroSubtitle}>
            Learn how to identify and protect yourself from spam messages and fraudulent communications
          </Text>
        </View>

        {/* What is Spam Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="help-circle" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>What is a Spam Message?</Text>
          </View>
          <Text style={styles.sectionText}>
            Spam messages are unsolicited and unwanted communications sent via SMS or email. 
            These are often sent in bulk by scammers or marketers and may contain:
          </Text>
          <View style={styles.bulletContainer}>
            <View style={styles.bulletItem}>
              <Ionicons name="alert-circle" size={16} color="#ef4444" />
              <Text style={styles.bulletText}>Advertising with no opt-out option</Text>
            </View>
            <View style={styles.bulletItem}>
              <Ionicons name="link" size={16} color="#ef4444" />
              <Text style={styles.bulletText}>Phishing links that steal personal data</Text>
            </View>
            <View style={styles.bulletItem}>
              <Ionicons name="trophy" size={16} color="#ef4444" />
              <Text style={styles.bulletText}>Fake lottery or loan approvals</Text>
            </View>
          </View>
          <Image
            source={require('../assets/s11.jpg')}
            style={styles.sectionImage}
            resizeMode="cover"
          />
        </View>

        {/* Categories Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>Categories of Spam</Text>
          </View>
          <Text style={styles.sectionText}>
            Spam messages come in various forms, including:
          </Text>
          <View style={styles.categoryGrid}>
            <View style={styles.categoryCard}>
              <Ionicons name="fish" size={24} color="#f59e0b" />
              <Text style={styles.categoryTitle}>Phishing Spam</Text>
              <Text style={styles.categoryText}>Fake bank login requests</Text>
            </View>
            <View style={styles.categoryCard}>
              <Ionicons name="megaphone" size={24} color="#8b5cf6" />
              <Text style={styles.categoryTitle}>Promotional</Text>
              <Text style={styles.categoryText}>Products without consent</Text>
            </View>
            <View style={styles.categoryCard}>
              <Ionicons name="cash" size={24} color="#ef4444" />
              <Text style={styles.categoryTitle}>Financial Fraud</Text>
              <Text style={styles.categoryText}>Get-rich schemes</Text>
            </View>
            <View style={styles.categoryCard}>
              <Ionicons name="key" size={24} color="#10b981" />
              <Text style={styles.categoryTitle}>OTP Scams</Text>
              <Text style={styles.categoryText}>Fake verification messages</Text>
            </View>
          </View>
          <Image
            source={require('../assets/s12.jpeg')}
            style={styles.sectionImage}
            resizeMode="cover"
          />
        </View>

        {/* Protection Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#10b981" />
            <Text style={styles.sectionTitle}>How to Protect Yourself</Text>
          </View>
          <View style={styles.protectionList}>
            <View style={styles.protectionItem}>
              <View style={styles.protectionIcon}>
                <Ionicons name="close-circle" size={20} color="#ef4444" />
              </View>
              <Text style={styles.protectionText}>Avoid clicking links from unknown sources</Text>
            </View>
            <View style={styles.protectionItem}>
              <View style={styles.protectionIcon}>
                <Ionicons name="lock-closed" size={20} color="#ef4444" />
              </View>
              <Text style={styles.protectionText}>Never share OTP or PIN with anyone</Text>
            </View>
            <View style={styles.protectionItem}>
              <View style={styles.protectionIcon}>
                <Ionicons name="phone-portrait" size={20} color="#10b981" />
              </View>
              <Text style={styles.protectionText}>Use spam detection apps (like SpamGuard)</Text>
            </View>
            <View style={styles.protectionItem}>
              <View style={styles.protectionIcon}>
                <Ionicons name="notifications" size={20} color="#10b981" />
              </View>
              <Text style={styles.protectionText}>Enable banking alerts & multi-factor authentication</Text>
            </View>
            <View style={styles.protectionItem}>
              <View style={styles.protectionIcon}>
                <Ionicons name="flag" size={20} color="#10b981" />
              </View>
              <Text style={styles.protectionText}>Report spam to your telecom provider</Text>
            </View>
          </View>
        </View>

        {/* Banking Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card" size={24} color="#667eea" />
            <Text style={styles.sectionTitle}>Why It Matters in Banking</Text>
          </View>
          <Text style={styles.sectionText}>
            Most banking frauds start with spam messages. Scammers impersonate banks or payment apps. 
            They send fake account alerts, fake offers, or urgent messages to trick users into sharing personal data.
          </Text>
          <Image
            source={require('../assets/s13.jpg')}
            style={styles.sectionImage}
            resizeMode="cover"
          />
          
          {/* Important Tip */}
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="bulb" size={24} color="#f59e0b" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Pro Tip</Text>
              <Text style={styles.tipText}>
                Always verify messages from your bank using their official app or helpline. 
                Banks never ask for sensitive information via SMS.
              </Text>
            </View>
          </View>
        </View>

        {/* Action Card */}
        <View style={styles.actionCard}>
          <Ionicons name="shield-checkmark" size={32} color="#10b981" />
          <Text style={styles.actionTitle}>Stay Protected with Digi Rakshak</Text>
          <Text style={styles.actionText}>
            Our advanced AI helps you identify and block spam messages before they reach you.
          </Text>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>You're Protected!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
  
};

const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#667eea',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
  },
  
  // Scroll Container
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  
  // Hero Section
  heroSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginTop: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  heroIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  
  // Section Card
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 16,
  },
  sectionImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 16,
  },
  
  // Bullet Points
  bulletContainer: {
    marginBottom: 16,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 8,
  },
  bulletText: {
    fontSize: 15,
    color: '#475569',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  
  // Category Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryCard: {
    width: (width - 60) / 2,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  
  // Protection List
  protectionList: {
    marginBottom: 16,
  },
  protectionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingLeft: 8,
  },
  protectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  protectionText: {
    fontSize: 15,
    color: '#475569',
    flex: 1,
    lineHeight: 20,
    paddingTop: 6,
  },
  
  // Tip Card
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  tipIcon: {
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 18,
  },
  
  // Action Card
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  actionText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});

export default AboutSpamScreen;
