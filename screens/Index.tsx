import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../components/SplashScreen';
import LoginScreen from '../components/LoginScreen';
import SignUpScreen from '../components/SignUpScreen';1
import OnboardingScreen from '../components/OnboardingScreen';
import MainDashboard from '../components/MainDashboard';
import VoiceTestScreen from '../components/VoiceTestScreen';
import InsightsPage from '../components/InsightsScreen';
import FingerTestScreen from '../components/FingerTestScreen';
import CameraTestScreen from '../components/CameraTestScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  Onboarding: undefined;
  Dashboard: undefined;
  VoiceTest: undefined;
  FingerTest: undefined;
  Insights: undefined;
  CameraTestScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Index: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash">
        {({ navigation }) => (
          <SplashScreen onComplete={() => navigation.replace('Login')} />
        )}
      </Stack.Screen>
      
      <Stack.Screen name="Login">
        {({ navigation }) => (
          <LoginScreen
            onLogin={() => navigation.replace('Dashboard')}
            onSwitchToSignup={() => navigation.navigate('SignUp')}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen name="SignUp">
        {({ navigation }) => (
          <SignUpScreen
            onSignUpSuccess={() => navigation.replace('Onboarding')}
            onSwitchToLogin={() => navigation.navigate('Login')}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen name="Onboarding">
        {({ navigation }) => (
          <OnboardingScreen
            onComplete={() => navigation.replace('Dashboard')}
            onSkip={() => navigation.replace('Dashboard')}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen name="Dashboard">
        {({ navigation }) => (
          <MainDashboard
            onStartVoiceTest={() => navigation.navigate('VoiceTest')}
            onStartFingerTest={() => navigation.navigate('FingerTest')}
            onStartCameraTest={() => navigation.navigate('CameraTestScreen')}
            onLogout={() => navigation.replace('Login')}
          />
        )}
      </Stack.Screen>
      
      <Stack.Screen name="VoiceTest" component={VoiceTestScreen} />
      <Stack.Screen name="FingerTest" component={FingerTestScreen} />
      <Stack.Screen name="Insights" component={InsightsPage} />
      <Stack.Screen name="CameraTestScreen" component={CameraTestScreen} />
    </Stack.Navigator>
  );
};

export default Index;