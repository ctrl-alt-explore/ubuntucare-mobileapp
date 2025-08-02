import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

interface OnboardingScreenProps {
  onComplete: (profileData: {
    height: string;
    weight: string;
    dob: Date;
    photoUri: string | null;
  }) => void;
  onSkip?: () => void;
}

const OnboardingScreen = ({ onComplete, onSkip }: OnboardingScreenProps) => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');

  const handleImageSelection = () => {
    Alert.alert('Select Photo', 'Choose an option', [
      {
        text: 'Camera',
        onPress: () => {
          launchCamera({ mediaType: 'photo', quality: 0.8 }, (response) => {
            if (response.didCancel) return;
            if (response.errorCode) {
              Alert.alert('Camera error', response.errorMessage || '');
              return;
            }
            if (response.assets?.[0]?.uri) {
              setPhotoUri(response.assets[0].uri);
            }
          });
        },
      },
      {
        text: 'Gallery',
        onPress: () => {
          launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
            if (response.didCancel) return;
            if (response.errorCode) {
              Alert.alert('Gallery error', response.errorMessage || '');
              return;
            }
            if (response.assets?.[0]?.uri) {
              setPhotoUri(response.assets[0].uri);
            }
          });
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const onChangeDate = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDob(selectedDate);
  };

  const validateAndSubmit = () => {
    setError('');
    if (!photoUri || !height.trim() || !weight.trim() || !dob) {
      setError('Please fill in all fields and add a photo.');
      return;
    }
    if (isNaN(Number(height)) || Number(height) <= 0) {
      setError('Please enter a valid height.');
      return;
    }
    if (isNaN(Number(weight)) || Number(weight) <= 0) {
      setError('Please enter a valid weight.');
      return;
    }

    onComplete({
      height: height.trim(),
      weight: weight.trim(),
      dob,
      photoUri,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>Tell us about yourself</Text>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.photoContainer} onPress={handleImageSelection}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Feather name="camera" size={40} color="#888" />
              <Text style={styles.photoPlaceholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 170"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 65"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
            <Text style={{ color: dob ? '#111' : '#999' }}>
              {dob ? dob.toDateString() : 'Select your date of birth'}
            </Text>
            <Feather name="calendar" size={20} color="#888" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dob || new Date(2000, 0, 1)}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={onChangeDate}
            />
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={validateAndSubmit}>
          <Text style={styles.buttonText}>Complete Onboarding</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  innerContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002B5B',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  photoContainer: {
    alignSelf: 'center',
    marginBottom: 32,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    color: '#888',
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    color: '#002B5B',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFF',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    color: '#111827',
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 12,
  },
  skipButtonText: {
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
});
