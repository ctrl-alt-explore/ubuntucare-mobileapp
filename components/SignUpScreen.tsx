import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

interface SignUpScreenProps {
  onSignUpSuccess: () => void;
  onSwitchToLogin: () => void;
}

const SignUpScreen = ({ onSignUpSuccess, onSwitchToLogin }: SignUpScreenProps) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateAndSignUp = () => {
    setError('');
    if (!name.trim() || !surname.trim() || !email.trim() || !password || !repeatPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }
    // You can add more validation (email format, password strength) here

    setIsLoading(true);

    // Simulate API signup request
    setTimeout(() => {
      setIsLoading(false);
      onSignUpSuccess();
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to UbuntuCare</Text>

        {/* Error Message */}
        {!!error && <Text style={styles.errorText}>{error}</Text>}

        {/* Name Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <View style={styles.inputWrapper}>
            <Feather name="user" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        {/* Surname Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Surname</Text>
          <View style={styles.inputWrapper}>
            <Feather name="user" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your surname"
              autoCapitalize="words"
              value={surname}
              onChangeText={setSurname}
            />
          </View>
        </View>

        {/* Email Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Feather name="mail" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {/* Password Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Feather name="lock" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconRight}
            >
              <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Repeat Password Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Repeat Password</Text>
          <View style={styles.inputWrapper}>
            <Feather name="lock" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Repeat your password"
              secureTextEntry={!showRepeatPassword}
              autoCapitalize="none"
              value={repeatPassword}
              onChangeText={setRepeatPassword}
            />
            <TouchableOpacity
              onPress={() => setShowRepeatPassword(!showRepeatPassword)}
              style={styles.iconRight}
            >
              <Feather name={showRepeatPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.6 }]}
          onPress={validateAndSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Switch to Login */}
        <View style={styles.signupContainer}>
          <Text style={styles.subtitle}>Already have an account? </Text>
          <TouchableOpacity onPress={onSwitchToLogin}>
            <Text style={styles.link}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  innerContainer: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002B5B',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    color: '#002B5B',
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#111827',
  },
  icon: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  link: {
    color: '#10B981',
    fontWeight: '600',
  },
});
