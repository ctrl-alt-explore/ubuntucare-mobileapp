import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native'; // ✅ Added
import Bot from './Bot';

interface MainDashboardProps {
  onStartVoiceTest: () => void;
  onStartFingerTest: () => void;
  onStartCameraTest: () => void; 
  onLogout: () => void;
}

const MainDashboard = ({ onStartVoiceTest, onStartFingerTest, onLogout }: MainDashboardProps) => {
  const navigation = useNavigation(); // ✅ Added

  const healthStats = [
    { label: 'BMI', value: '22.5', status: 'Normal', color: '#10B981' },
    { label: 'Heart Rate', value: '72 BPM', status: 'Good', color: '#2563EB' },
    { label: 'SpO₂', value: '98%', status: 'Excellent', color: '#10B981' },
    { label: 'Stress Level', value: 'Low', status: 'Good', color: '#10B981' },
  ];

  const testingFeatures = [
    {
      icon: 'mic',
      title: 'Voice Analysis',
      description: 'TB & Flu Detection',
      color: '#DBEAFE',
      iconColor: '#2563EB',
      onPress: onStartVoiceTest,
    },
    {
      icon: 'camera',
      title: 'Camera Test',
      description: 'Heart Rate & Stress',
      color: '#D1FAE5',
      iconColor: '#10B981',
      onPress: () => navigation.navigate('CameraTestScreen'), // ✅ Updated
    },
    {
      icon: 'zap',
      title: 'Finger Test',
      description: 'SpO₂ & HRV',
      color: '#FEF3C7',
      iconColor: '#F59E0B',
      onPress: onStartFingerTest,
    },
  ];

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Shawn</Text>
            <Text style={styles.subGreeting}>How are you feeling today?</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.avatar}>
              <Feather name="user" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
              <Feather name="log-out" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Health Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Health Stats</Text>
          <View style={styles.statsGrid}>
            {healthStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={[styles.statStatus, { color: stat.color }]}>{stat.status}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Health Screenings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Screenings</Text>
          {testingFeatures.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.featureCard, { backgroundColor: feature.color }]}
              onPress={feature.onPress}
            >
              <View style={[styles.iconWrapper, { backgroundColor: '#fff' }]}>
                <Feather name={feature.icon} size={24} color={feature.iconColor} />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#2563EB" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityIconWrapper}>
              <Feather name="heart" size={20} color="#10B981" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityText}>Voice test completed</Text>
              <Text style={styles.activitySubtext}>No concerns detected • 2 hours ago</Text>
            </View>
            <Feather name="check-circle" size={20} color="#10B981" />
          </View>
        </View>
      </ScrollView>

      {/* AI Bot pinned bottom-right */}
      <View style={styles.botContainer}>
        <Bot />
      </View>
    </>
  );
};

export default MainDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  subGreeting: {
    color: '#6B7280',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    backgroundColor: '#2563EB',
    borderRadius: 50,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '47%',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  statStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontWeight: '600',
    color: '#1E3A8A',
  },
  featureDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  activityCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    elevation: 1,
  },
  activityIconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    fontWeight: '500',
    color: '#1E3A8A',
  },
  activitySubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  botContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 999,
  },
});
