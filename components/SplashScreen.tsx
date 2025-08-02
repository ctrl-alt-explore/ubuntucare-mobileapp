import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';

// Correct relative path to the logo image
const healthsenseLogo = require('../assets/Logo.png');

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const logoAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  const slides = [
    {
      id: 0,
      type: 'splash',
      title: 'UbuntuCare AI',
      subtitle: 'Your Health, Reimagined',
      showLogo: true,
    },
    {
      id: 1,
      type: 'feature',
      title: 'AI-Powered Health Analysis',
      subtitle: 'Get instant health insights using advanced artificial intelligence technology',
      description: 'Upload your medical reports, symptoms, or health data and receive personalized analysis and recommendations.',
      icon: '🏥',
    },
    {
      id: 2,
      type: 'feature',
      title: 'Personalized Care Plans',
      subtitle: 'Tailored health recommendations just for you',
      description: 'Receive customized treatment suggestions, medication reminders, and lifestyle recommendations based on your unique health profile.',
      icon: '📋',
    },
    {
      id: 3,
      type: 'feature',
      title: '24/7 Health Monitoring',
      subtitle: 'Your health companion, always available',
      description: 'Track your symptoms, monitor your progress, and get immediate support whenever you need it.',
      icon: '📱',
    },
  ];

  useEffect(() => {
    if (currentSlide === 0) {
      Animated.sequence([
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          delay: 300,
        }),
        Animated.timing(textAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          delay: 500,
        }),
      ]).start();

      const autoAdvanceTimer = setTimeout(() => {
        goToNextSlide();
      }, 3500);

      return () => clearTimeout(autoAdvanceTimer);
    }
  }, [currentSlide]);

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      scrollViewRef.current?.scrollTo({
        x: prevSlide * width,
        animated: true,
      });
    }
  };

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const renderSplashSlide = (slide: any) => (
    <View style={[styles.slide, styles.splashSlide]}>
      <Animated.View
        style={[
          styles.logoWrapper,
          { opacity: logoAnim, transform: [{ scale: logoAnim }] },
        ]}
      >
        <Image
          source={healthsenseLogo}
          style={styles.logo}
          resizeMode="cover"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.textWrapper,
          {
            opacity: textAnim,
            transform: [
              {
                translateY: textAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </Animated.View>
    </View>
  );

  const renderFeatureSlide = (slide: any) => (
    <View style={[styles.slide, styles.featureSlide]}>
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>{slide.icon}</Text>
      </View>
      <View style={styles.featureTextWrapper}>
        <Text style={styles.featureTitle}>{slide.title}</Text>
        <Text style={styles.featureSubtitle}>{slide.subtitle}</Text>
        <Text style={styles.featureDescription}>{slide.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#101C40" barStyle="light-content" />
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEnabled={currentSlide > 0}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={{ width }}>
            {slide.type === 'splash' 
              ? renderSplashSlide(slide) 
              : renderFeatureSlide(slide)
            }
          </View>
        ))}
      </ScrollView>

      {/* Skip button - always visible */}
      <TouchableOpacity onPress={onComplete} style={styles.skipButton}>
        <Text style={styles.skipText}>Skip →</Text>
      </TouchableOpacity>

      {/* Navigation controls - only show after splash */}
      {currentSlide > 0 && (
        <View style={styles.navigationContainer}>
          {/* Page indicators */}
          <View style={styles.indicatorContainer}>
            {slides.slice(1).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentSlide === index + 1 ? styles.activeIndicator : styles.inactiveIndicator,
                ]}
              />
            ))}
          </View>

          {/* Navigation buttons */}
          <View style={styles.buttonContainer}>
            {currentSlide > 1 && (
              <TouchableOpacity onPress={goToPreviousSlide} style={styles.navButton}>
                <Text style={styles.navButtonText}>← Back</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              onPress={currentSlide === slides.length - 1 ? onComplete : goToNextSlide} 
              style={[styles.navButton, styles.nextButton]}
            >
              <Text style={styles.nextButtonText}>
                {currentSlide === slides.length - 1 ? 'Get Started' : 'Next →'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101C40',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  splashSlide: {
    justifyContent: 'center',
  },
  featureSlide: {
    justifyContent: 'center',
    paddingTop: 60,
  },
  logoWrapper: {
    marginBottom: 30,
  },
  logo: {
    width: 220,
    height: 220,
    borderRadius: 40,
  },
  textWrapper: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffffcc',
    fontWeight: '300',
    textAlign: 'center',
  },
  iconWrapper: {
    marginBottom: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 40,
  },
  featureTextWrapper: {
    alignItems: 'center',
    maxWidth: 300,
  },
  featureTitle: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  featureSubtitle: {
    fontSize: 18,
    color: '#ffffffcc',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 16,
    color: '#ffffff99',
    textAlign: 'center',
    lineHeight: 24,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 32,
    zIndex: 10,
  },
  skipText: {
    color: '#ffffffcc',
    fontSize: 14,
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
  },
  inactiveIndicator: {
    backgroundColor: '#ffffff33',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  nextButton: {
    backgroundColor: '#fff',
    marginLeft: 'auto',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonText: {
    color: '#101C40',
    fontSize: 16,
    fontWeight: '600',
  },
});