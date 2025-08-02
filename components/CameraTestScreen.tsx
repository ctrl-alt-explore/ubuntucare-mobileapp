import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
// import Video from 'react-native-video'; // Commented out due to RCTVideo error

const CameraTestScreen = () => {
  const [media, setMedia] = useState<any>(null);
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack(); // This will go back to the previous screen (Dashboard)
  };

  const handleLaunchCamera = (mediaType: 'photo' | 'video') => {
    launchCamera(
      {
        mediaType,
        cameraType: 'front',
        durationLimit: 15,
        videoQuality: 'high',
        includeBase64: false,
        saveToPhotos: true,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          console.error('Camera error:', response.errorMessage);
        } else {
          setMedia(response.assets?.[0]);
        }
      }
    );
  };

  const analyzeMedia = () => {
    Alert.alert('Processing', 'Analyzing heart rate and stress...');
    // Call your AI model here using media.uri or base64
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Feather name="arrow-left" size={24} color="#007bff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Camera Test</Text>
          <View style={styles.placeholder} />
        </View>

        <Text style={styles.title}>Health Camera Analysis</Text>
        <Text style={styles.subtitle}>Capture a photo or video for heart rate and stress analysis</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLaunchCamera('photo')}>
          <Feather name="camera" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLaunchCamera('video')}>
          <Feather name="video" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Record Video</Text>
        </TouchableOpacity>

        {media && (
          <View style={styles.preview}>
            {media.type === 'video' ? (
              <View style={[styles.media, styles.videoPlaceholder]}>
                <Feather name="play-circle" size={50} color="#fff" />
                <Text style={styles.videoText}>Video Preview</Text>
                <Text style={styles.videoSubtext}>
                  {media.fileName || 'Video recorded successfully'}
                </Text>
              </View>
            ) : (
              <Image source={{ uri: media.uri }} style={styles.media} />
            )}
          </View>
        )}

        {media && (
          <TouchableOpacity style={styles.analyzeButton} onPress={analyzeMedia}>
            <Feather name="activity" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Analyze Health Data</Text>
          </TouchableOpacity>
        )}

        {/* Go back to dashboard button */}
        <TouchableOpacity style={styles.dashboardButton} onPress={handleGoBack}>
          <Feather name="home" size={20} color="#007bff" style={styles.buttonIcon} />
          <Text style={styles.dashboardButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CameraTestScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f8ff',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 15,
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40, // Same width as back button for centering
  },
  title: {
    fontSize: 24,
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginVertical: 8,
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  preview: {
    marginTop: 20,
    width: '90%',
    height: 250,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  videoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  videoSubtext: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  analyzeButton: {
    marginTop: 20,
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dashboardButton: {
    marginTop: 30,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#007bff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dashboardButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '600',
  },
});