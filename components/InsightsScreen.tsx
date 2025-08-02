import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';

const { width } = Dimensions.get('window');

const InsightsPage = ({ navigation }) => {
  const [flippedCard, setFlippedCard] = useState(null);
  const [activeTab, setActiveTab] = useState('features');

  // Dummy user data
  const user = {
    firstName: 'John',
    surname: 'Doe',
    profilePicture: 'https://via.placeholder.com/120',
  };

  const features = [
    {
      id: 1,
      title: 'Cough Detection',
      subtitle: 'TB, Dry Cough Analysis',
      icon: '🎤',
      description: 'Advanced AI analyzes your cough patterns to detect potential respiratory conditions including tuberculosis, dry cough, and other pulmonary issues.',
      color: '#eff6ff',
      borderColor: '#bfdbfe',
      iconBg: '#dbeafe'
    },
    {
      id: 2,
      title: 'Flashlight Finger Scan',
      subtitle: 'Heart Rate & Blood Oxygen',
      icon: '🔦',
      description: 'Use your phone\'s flashlight and camera to measure heart rate and blood oxygen levels by placing your finger over the camera lens.',
      color: '#fef2f2',
      borderColor: '#fecaca',
      iconBg: '#fee2e2'
    },
    {
      id: 3,
      title: 'Video Face Scan',
      subtitle: 'Stress & Heart Rate Detection',
      icon: '📷',
      description: 'Analyze facial micro-expressions and color changes to detect stress levels, heart rate variability, and emotional wellness indicators.',
      color: '#f0fdf4',
      borderColor: '#bbf7d0',
      iconBg: '#dcfce7'
    },
    {
      id: 4,
      title: 'HRV Analysis',
      subtitle: 'Stress & Arrhythmia Monitoring',
      icon: '📊',
      description: 'Heart Rate Variability analysis to monitor stress levels, detect arrhythmias, and assess overall cardiovascular health patterns.',
      color: '#faf5ff',
      borderColor: '#d8b4fe',
      iconBg: '#e9d5ff'
    }
  ];

  const healthStats = [
    { label: 'Heart Rate', value: '72 BPM', trend: '+2%', color: '#dc2626' },
    { label: 'Blood Oxygen', value: '98%', trend: 'Normal', color: '#2563eb' },
    { label: 'Stress Level', value: 'Low', trend: '-5%', color: '#16a34a' },
    { label: 'Sleep Quality', value: '85%', trend: '+12%', color: '#9333ea' }
  ];

  const handleCardFlip = (cardId) => {
    setFlippedCard(flippedCard === cardId ? null : cardId);
  };

  const handleTest = (featureTitle) => {
    if (featureTitle === 'Cough Detection') {
      navigation.navigate('VoiceTest');
    } else {
      console.log(`Testing ${featureTitle}`);
      // Navigate to other test screens as needed
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleChatbot = () => {
    console.log('Opening AI chatbot');
    // Navigate to chatbot screen
  };

  const renderFeatureCard = (feature) => (
    <TouchableOpacity
      key={feature.id}
      style={[
        styles.card,
        { backgroundColor: feature.color, borderColor: feature.borderColor },
        flippedCard === feature.id && styles.flippedCard
      ]}
      onPress={() => handleCardFlip(feature.id)}
      activeOpacity={0.8}
    >
      {flippedCard !== feature.id ? (
        // Front of card
        <View style={styles.cardFront}>
          <View style={[styles.iconContainer, { backgroundColor: feature.iconBg }]}>
            <Text style={styles.iconText}>{feature.icon}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{feature.title}</Text>
            <Text style={styles.cardSubtitle}>{feature.subtitle}</Text>
          </View>
          <View style={styles.tapHint}>
            <Text style={styles.tapHintText}>Tap to learn more</Text>
          </View>
        </View>
      ) : (
        // Back of card
        <View style={styles.cardBack}>
          <View style={styles.cardBackHeader}>
            <View style={[styles.iconContainerSmall, { backgroundColor: feature.iconBg }]}>
              <Text style={styles.iconTextSmall}>{feature.icon}</Text>
            </View>
            <Text style={styles.cardTitle}>{feature.title}</Text>
          </View>
          <Text style={styles.cardDescription}>{feature.description}</Text>
          <View style={styles.cardButtons}>
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => handleTest(feature.title)}
            >
              <Text style={styles.testButtonText}>Start Test</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => handleCardFlip(feature.id)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderHealthStat = (stat, index) => (
    <View key={index} style={styles.statCard}>
      <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
      <Text style={styles.statLabel}>{stat.label}</Text>
      <Text style={styles.statTrend}>{stat.trend}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#3b82f6" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Insights</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.firstName} {user.surname}</Text>
            <Text style={styles.profileWelcome}>Welcome back!</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="Search health features..."
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <View style={styles.tabWrapper}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'features' && styles.activeTab]}
              onPress={() => setActiveTab('features')}
            >
              <Text style={[styles.tabText, activeTab === 'features' && styles.activeTabText]}>
                Features
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'summary' && styles.activeTab]}
              onPress={() => setActiveTab('summary')}
            >
              <Text style={[styles.tabText, activeTab === 'summary' && styles.activeTabText]}>
                Summary
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {activeTab === 'features' && (
            <View style={styles.featuresContainer}>
              {features.map(renderFeatureCard)}
            </View>
          )}

          {activeTab === 'summary' && (
            <View style={styles.summaryContainer}>
              {/* Health Stats */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Vital Signs</Text>
                  <Text style={styles.sectionIcon}>📊</Text>
                </View>
                <View style={styles.statsGrid}>
                  {healthStats.map(renderHealthStat)}
                </View>
              </View>

              {/* Trend Chart */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>7-Day Trends</Text>
                  <Text style={styles.sectionIcon}>📈</Text>
                </View>
                <View style={styles.chartPlaceholder}>
                  <Text style={styles.chartIcon}>📊</Text>
                  <Text style={styles.chartText}>Interactive charts coming soon</Text>
                </View>
              </View>

              {/* Recent Alerts */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Alerts</Text>
                  <Text style={styles.sectionIcon}>⚠️</Text>
                </View>
                <View style={styles.alertsContainer}>
                  <View style={[styles.alert, styles.warningAlert]}>
                    <View style={styles.alertDot} />
                    <View style={styles.alertContent}>
                      <Text style={styles.alertTitle}>Elevated stress detected</Text>
                      <Text style={styles.alertTime}>2 hours ago</Text>
                    </View>
                  </View>
                  <View style={[styles.alert, styles.successAlert]}>
                    <View style={[styles.alertDot, styles.successDot]} />
                    <View style={styles.alertContent}>
                      <Text style={styles.alertTitle}>Heart rate normalized</Text>
                      <Text style={styles.alertTime}>4 hours ago</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating AI Chat Button */}
      <TouchableOpacity style={styles.chatButton} onPress={handleChatbot}>
        <Text style={styles.chatButtonText}>💬</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#374151',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    paddingVertical: 20,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#3b82f6',
    backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileWelcome: {
    fontSize: 16,
    color: '#bfdbfe',
    marginTop: 4,
  },
  searchContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
    color: '#9ca3af',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tabWrapper: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  featuresContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  flippedCard: {
    transform: [{ scale: 1.02 }],
  },
  cardFront: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  tapHint: {
    alignItems: 'center',
  },
  tapHintText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  cardBack: {
    gap: 16,
  },
  cardBackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainerSmall: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconTextSmall: {
    fontSize: 20,
  },
  cardDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  cardButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  testButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#6b7280',
    fontSize: 16,
  },
  summaryContainer: {
    gap: 24,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  sectionIcon: {
    fontSize: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 80) / 2,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statTrend: {
    fontSize: 12,
    color: '#16a34a',
  },
  chartPlaceholder: {
    height: 128,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartIcon: {
    fontSize: 32,
    marginBottom: 8,
    color: '#9ca3af',
  },
  chartText: {
    fontSize: 14,
    color: '#6b7280',
  },
  alertsContainer: {
    gap: 12,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  warningAlert: {
    backgroundColor: '#fefce8',
  },
  successAlert: {
    backgroundColor: '#f0fdf4',
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#eab308',
  },
  successDot: {
    backgroundColor: '#22c55e',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  chatButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chatButtonText: {
    fontSize: 24,
  },
});

export default InsightsPage;