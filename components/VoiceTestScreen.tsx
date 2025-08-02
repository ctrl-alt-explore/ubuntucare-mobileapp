import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
  NativeModules
} from 'react-native';

// Safe Voice module import with fallback
let Voice;
try {
  Voice = require('@react-native-voice/voice').default;
} catch (e) {
  console.error('Voice module not available', e);
}

const { width, height } = Dimensions.get('window');

interface AnalysisResult {
  coughDetected: boolean;
  coughType?: string;
  severity?: 'Mild' | 'Moderate' | 'Severe';
  confidence?: number;
  recommendations?: string[];
}

interface VoiceTestProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: any) => void;
  };
}

type RecordingState = 'ready' | 'recording' | 'analyzing';

const VoiceTest: React.FC<VoiceTestProps> = ({ navigation }) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('ready');
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isVoiceAvailable, setIsVoiceAvailable] = useState<boolean>(true); // Set to true for demo
  
  // Animation refs
  const waveAnimations = useRef<Animated.Value[]>(
    [...Array(15)].map(() => new Animated.Value(0.1))
  ).current;
  const pulseAnimation = useRef<Animated.Value>(new Animated.Value(1)).current;
  const recordButtonScale = useRef<Animated.Value>(new Animated.Value(1)).current;
  
  // Timer and animation refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const waveAnimationRefs = useRef<Animated.CompositeAnimation[]>([]);
  const recordingStartTime = useRef<number>(0);

  const isRecording = recordingState === 'recording';
  const isAnalyzing = recordingState === 'analyzing';

  useEffect(() => {
    if (isRecording) {
      startWaveAnimation();
      startTimer();
    } else {
      stopWaveAnimation();
      stopTimer();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      waveAnimationRefs.current.forEach(animation => animation.stop());
    };
  }, [recordingState]);

  const startTimer = () => {
    recordingStartTime.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - recordingStartTime.current) / 1000);
      setRecordingTime(elapsed);
    }, 100); // Update every 100ms for smooth timer
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startWaveAnimation = () => {
    waveAnimationRefs.current.forEach(animation => animation.stop());
    waveAnimationRefs.current = [];

    const animateWave = (animation: Animated.Value, index: number) => {
      const baseHeight = 0.15 + (Math.sin(index * 0.5) * 0.1); // Calm base pattern
      const waveAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: baseHeight + Math.random() * 0.3,
            duration: 800 + Math.random() * 400, // Slower, calmer animation
            useNativeDriver: false,
          }),
          Animated.timing(animation, {
            toValue: baseHeight + Math.random() * 0.2,
            duration: 600 + Math.random() * 400,
            useNativeDriver: false,
          }),
        ])
      );
      
      waveAnimation.start();
      waveAnimationRefs.current.push(waveAnimation);
    };

    waveAnimations.forEach((animation, index) => {
      setTimeout(() => animateWave(animation, index), index * 80);
    });

    // Gentle pulse animation
    const pulseAnimationLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    
    pulseAnimationLoop.start();
    waveAnimationRefs.current.push(pulseAnimationLoop);
  };

  const stopWaveAnimation = () => {
    waveAnimationRefs.current.forEach(animation => animation.stop());
    waveAnimationRefs.current = [];

    waveAnimations.forEach(animation => {
      animation.stopAnimation();
      Animated.timing(animation, {
        toValue: 0.1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    });
    
    pulseAnimation.stopAnimation();
    Animated.timing(pulseAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const startRecording = async () => {
    setRecordingState('recording');
    setRecordingTime(0);
    setAnalysisResult(null);
    
    Animated.sequence([
      Animated.timing(recordButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(recordButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const stopRecording = async () => {
    setRecordingState('analyzing');
    
    // Simulate analysis time (2-4 seconds)
    const analysisTime = 2500 + Math.random() * 1500;
    
    setTimeout(() => {
      setRecordingState('ready');
      // Demo always shows dry cough result
      setAnalysisResult({
        coughDetected: true,
        coughType: 'Dry Cough',
        severity: 'Mild',
        confidence: 87 + Math.floor(Math.random() * 10), // Random confidence between 87-96%
        recommendations: [
          'Stay well hydrated with warm liquids',
          'Consider honey or throat lozenges',
          'Avoid irritants like smoke or dust',
          'Monitor symptoms and rest adequately',
          'Consult healthcare provider if symptoms persist'
        ]
      });
    }, analysisTime);
  };

  const handleRecordPress = () => {
    if (recordingState === 'recording') {
      stopRecording();
    } else if (recordingState === 'ready') {
      startRecording();
    }
    // Do nothing if analyzing
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const centisecs = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centisecs.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    if (isRecording) {
      Alert.alert(
        'Stop Recording?',
        'Are you sure you want to stop the recording and go back?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Stop & Go Back', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Mild': return '#16a34a';
      case 'Moderate': return '#eab308';
      case 'Severe': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusText = () => {
    switch (recordingState) {
      case 'analyzing':
        return {
          title: 'Analyzing Audio...',
          subtitle: 'AI is processing your voice sample'
        };
      case 'recording':
        return {
          title: 'Recording in Progress',
          subtitle: 'Speak normally or cough into the microphone'
        };
      default:
        return {
          title: 'Ready for Demo',
          subtitle: 'Tap the microphone to start cough analysis demo'
        };
    }
  };

  const getRecordButtonProps = () => {
    switch (recordingState) {
      case 'analyzing':
        return {
          icon: '⏳',
          text: 'Analyzing Audio...',
          style: styles.analyzingButton
        };
      case 'recording':
        return {
          icon: '⏹️',
          text: 'Stop Recording',
          style: styles.recordingButton
        };
      default:
        return {
          icon: '🎤',
          text: 'Start Demo',
          style: styles.recordButton
        };
    }
  };

  const renderSoundWaves = () => {
    return (
      <View style={styles.waveContainer}>
        {waveAnimations.map((animation, index) => (
          <Animated.View
            key={index}
            style={[
              styles.waveBar,
              {
                height: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [8, 100],
                }),
                backgroundColor: isRecording ? '#3b82f6' : '#e5e7eb',
                opacity: isRecording ? 0.8 : 0.4,
              }
            ]}
          />
        ))}
      </View>
    );
  };

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;

    return (
      <View style={styles.resultContainer}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultIcon}>🩺</Text>
          <Text style={styles.resultTitle}>Demo Analysis Complete</Text>
        </View>
        
        <View style={styles.resultCard}>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Cough Detected:</Text>
            <Text style={[
              styles.resultValue, 
              { color: analysisResult.coughDetected ? '#dc2626' : '#16a34a' }
            ]}>
              {analysisResult.coughDetected ? 'Yes' : 'No'}
            </Text>
          </View>
          
          {analysisResult.coughDetected && analysisResult.coughType && (
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Type:</Text>
              <Text style={styles.resultValue}>{analysisResult.coughType}</Text>
            </View>
          )}
          
          {analysisResult.coughDetected && analysisResult.severity && (
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Severity:</Text>
              <Text style={[
                styles.resultValue, 
                { color: getSeverityColor(analysisResult.severity) }
              ]}>
                {analysisResult.severity}
              </Text>
            </View>
          )}
          
          {analysisResult.confidence && (
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Confidence:</Text>
              <Text style={styles.resultValue}>{analysisResult.confidence}%</Text>
            </View>
          )}
        </View>

        {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsTitle}>Recommendations:</Text>
            {analysisResult.recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Text style={styles.recommendationBullet}>•</Text>
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.demoNotice}>
          <Text style={styles.demoNoticeText}>
            ⚠️ This is a demonstration. Real analysis would require medical-grade AI models.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.newTestButton}
          onPress={() => {
            setAnalysisResult(null);
            setRecordingTime(0);
          }}
        >
          <Text style={styles.newTestButtonText}>Try Demo Again</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const statusText = getStatusText();
  const recordButtonProps = getRecordButtonProps();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1e40af" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cough Analysis Demo</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.statusSection}>
          <Text style={styles.statusTitle}>{statusText.title}</Text>
          <Text style={styles.statusSubtitle}>{statusText.subtitle}</Text>
          
          {(isRecording || isAnalyzing) && (
            <View style={styles.timerContainer}>
              <View style={styles.recordingIndicator} />
              <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
            </View>
          )}
        </View>

        <View style={styles.visualizationContainer}>
          {renderSoundWaves()}
        </View>

        <View style={styles.recordSection}>
          <Animated.View style={{ transform: [{ scale: recordButtonScale }] }}>
            <TouchableOpacity
              style={[styles.recordButton, recordButtonProps.style]}
              onPress={handleRecordPress}
              disabled={isAnalyzing}
            >
              <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
                <Text style={styles.recordButtonIcon}>
                  {recordButtonProps.icon}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
          
          <Text style={styles.recordButtonText}>
            {recordButtonProps.text}
          </Text>
        </View>

        {renderAnalysisResult()}

        {recordingState === 'ready' && !analysisResult && (
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Demo Instructions:</Text>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>1</Text>
              <Text style={styles.instructionText}>Tap the microphone to start demo recording</Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>2</Text>
              <Text style={styles.instructionText}>Speak, cough, or stay silent</Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>3</Text>
              <Text style={styles.instructionText}>AI will simulate detecting a dry cough</Text>
            </View>
            <View style={styles.demoWarning}>
              <Text style={styles.demoWarningText}>
                🎭 This is a demonstration only. Results are simulated for demo purposes.
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e40af',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#ffffff',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginLeft: -40,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 20,
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dc2626',
    marginRight: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  visualizationContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    gap: 6,
  },
  waveBar: {
    width: 10,
    borderRadius: 5,
    minHeight: 8,
  },
  recordSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  recordingButton: {
    backgroundColor: '#dc2626',
    shadowColor: '#dc2626',
  },
  analyzingButton: {
    backgroundColor: '#6b7280',
    shadowColor: '#6b7280',
  },
  recordButtonIcon: {
    fontSize: 40,
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  resultContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  resultCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  resultLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  recommendationsContainer: {
    marginBottom: 20,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recommendationBullet: {
    fontSize: 16,
    color: '#3b82f6',
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  demoNotice: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  demoNoticeText: {
    fontSize: 12,
    color: '#92400e',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  newTestButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  newTestButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  demoWarning: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  demoWarningText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default VoiceTest;