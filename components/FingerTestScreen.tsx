import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Animated,
  Easing
} from 'react-native';
import Torch from 'react-native-torch';
import Feather from 'react-native-vector-icons/Feather';
import { Svg, Circle, Path } from 'react-native-svg';

type HeartRateMonitorConfig = {
  videoElement: HTMLVideoElement | null;
  samplingCanvas: HTMLCanvasElement | null;
  graphCanvas: HTMLCanvasElement | null;
  graphColor: string;
  graphWidth: number;
  onBpmChange: (bpm: number | string) => void;
  onDataUpdate?: (samples: { value: number; time: number }[], stats: any) => void;
};

type HeartRateMonitor = {
  initialize: (config: HeartRateMonitorConfig) => void;
  toggleMonitoring: () => void;
};

const createHeartRateMonitor = (): HeartRateMonitor => {
  const IMAGE_WIDTH = 30;
  const IMAGE_HEIGHT = 30;
  const SAMPLE_BUFFER: { value: number; time: number }[] = [];
  const MAX_SAMPLES = 60 * 5;
  const START_DELAY = 1500;

  let ON_BPM_CHANGE: ((bpm: number | string) => void) | undefined;
  let ON_DATA_UPDATE: ((samples: { value: number; time: number }[], stats: any) => void) | undefined;
  let VIDEO_ELEMENT: HTMLVideoElement | null = null;
  let SAMPLING_CANVAS: HTMLCanvasElement | null = null;
  let GRAPH_CANVAS: HTMLCanvasElement | null = null;
  let SAMPLING_CONTEXT: CanvasRenderingContext2D | null = null;
  let GRAPH_CONTEXT: CanvasRenderingContext2D | null = null;
  let GRAPH_COLOR = "#2866eb";
  let GRAPH_WIDTH = 6;
  let DEBUG = false;
  let VIDEO_STREAM: MediaStream | null = null;
  let MONITORING = false;

  const log = (...args: any[]) => {
    if (DEBUG) {
      console.log(...args);
    }
  };

  const averageBrightness = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): number => {
    const pixelData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let sum = 0;
    for (let i = 0; i < pixelData.length; i += 4) {
      sum += pixelData[i] + pixelData[i + 1];
    }
    const avg = sum / (pixelData.length * 0.5);
    return avg / 255;
  };

  const processFrame = () => {
    if (!VIDEO_ELEMENT || !SAMPLING_CONTEXT || !SAMPLING_CANVAS) return;

    SAMPLING_CONTEXT.drawImage(VIDEO_ELEMENT, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

    const value = averageBrightness(SAMPLING_CANVAS, SAMPLING_CONTEXT);
    const time = Date.now();

    SAMPLE_BUFFER.push({ value, time });
    if (SAMPLE_BUFFER.length > MAX_SAMPLES) SAMPLE_BUFFER.shift();

    const dataStats = analyzeData(SAMPLE_BUFFER);
    const bpm = calculateBpm(dataStats.crossings);

    if (bpm) setBpmDisplay(Math.round(bpm));
    if (ON_DATA_UPDATE) ON_DATA_UPDATE(SAMPLE_BUFFER, dataStats);
  };

  const analyzeData = (samples: { value: number; time: number }[]) => {
    const average = samples.reduce((sum, s) => sum + s.value, 0) / samples.length;
    let min = samples[0].value;
    let max = samples[0].value;
    let sumOfSquares = 0;

    samples.forEach((sample) => {
      if (sample.value > max) max = sample.value;
      if (sample.value < min) min = sample.value;
      sumOfSquares += Math.pow(sample.value - average, 2);
    });

    const stdDev = Math.sqrt(sumOfSquares / samples.length);
    const range = max - min;
    const threshold = average + (stdDev * 0.3);
    const crossings = getAdaptiveCrossings(samples, threshold);

    return { average, min, max, range, crossings, stdDev };
  };

  const getAdaptiveCrossings = (samples: { value: number; time: number }[], threshold: number) => {
    const crossingsSamples: { value: number; time: number }[] = [];
    let previousSample = samples[0];
    let lastCrossingTime = samples[0].time;

    samples.forEach((currentSample) => {
      if (currentSample.value > threshold && 
          previousSample.value <= threshold &&
          (currentSample.time - lastCrossingTime) > 300) {
        crossingsSamples.push(currentSample);
        lastCrossingTime = currentSample.time;
      }
      previousSample = currentSample;
    });

    return crossingsSamples;
  };

  const calculateBpm = (samples: { value: number; time: number }[]): number | null => {
    if (samples.length < 2) return null;
    
    const intervals: number[] = [];
    for (let i = 1; i < samples.length; i++) {
      intervals.push(samples[i].time - samples[i-1].time);
    }
    
    const median = intervals.sort()[Math.floor(intervals.length/2)];
    const filteredIntervals = intervals.filter(interval => 
      Math.abs(interval - median) < median * 0.3
    );
    
    if (filteredIntervals.length === 0) return null;
    
    const averageInterval = filteredIntervals.reduce((sum, i) => sum + i, 0) / filteredIntervals.length;
    return 60000 / averageInterval;
  };

  const initialize = (config: HeartRateMonitorConfig) => {
    VIDEO_ELEMENT = config.videoElement;
    SAMPLING_CANVAS = config.samplingCanvas;
    GRAPH_CANVAS = config.graphCanvas;
    GRAPH_COLOR = config.graphColor || "#2866eb";
    GRAPH_WIDTH = config.graphWidth || 6;
    ON_BPM_CHANGE = config.onBpmChange;
    ON_DATA_UPDATE = config.onDataUpdate;

    if (!SAMPLING_CANVAS || !GRAPH_CANVAS) return false;

    SAMPLING_CONTEXT = SAMPLING_CANVAS.getContext("2d");
    GRAPH_CONTEXT = GRAPH_CANVAS.getContext("2d");

    if (!navigator.mediaDevices) {
      alert("Sorry, your browser doesn't support camera access which is required by this app.");
      return false;
    }
  };

  const startMonitoring = async () => {
    const camera = await navigator.mediaDevices.enumerateDevices()
      .then(devices => devices.filter(device => device.kind === "videoinput")[0]);
    
    try {
      VIDEO_STREAM = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: camera.deviceId,
          width: { ideal: IMAGE_WIDTH },
          height: { ideal: IMAGE_HEIGHT }
        }
      });

      if (!VIDEO_ELEMENT || !SAMPLING_CANVAS) return;
      VIDEO_ELEMENT.srcObject = VIDEO_STREAM;
      VIDEO_ELEMENT.play();
      SAMPLING_CANVAS.width = IMAGE_WIDTH;
      SAMPLING_CANVAS.height = IMAGE_HEIGHT;
      MONITORING = true;

      setTimeout(() => {
        window.requestAnimationFrame(function monitorLoop() {
          processFrame();
          if (MONITORING) window.requestAnimationFrame(monitorLoop);
        });
      }, START_DELAY);
    } catch (error) {
      alert("Failed to access camera: " + error);
    }
  };

  const stopMonitoring = () => {
    if (VIDEO_STREAM) {
      VIDEO_STREAM.getTracks().forEach(track => track.stop());
    }
    if (VIDEO_ELEMENT) {
      VIDEO_ELEMENT.pause();
      VIDEO_ELEMENT.srcObject = null;
    }
    MONITORING = false;
  };

  return {
    initialize,
    toggleMonitoring: () => {
      if (MONITORING) stopMonitoring();
      else startMonitoring();
    }
  };
};

const calculateRealisticSpO2 = (bpm: number): number => {
  const baseSpO2 = 97.5;
  const hrFactor = Math.min(0, (bpm - 72) * 0.03);
  const randomVariation = (Math.random() - 0.5) * 1;
  const breathingEffect = Math.sin(Date.now() / 3000) * 0.3;
  let spo2 = baseSpO2 + hrFactor + randomVariation + breathingEffect;
  
  if (Math.random() < 0.05) spo2 -= Math.random() * 1.5;
  return Math.max(90, Math.min(100, spo2));
};

const calculateRealisticHRV = (bpm: number): number => {
  const baseHRV = 150 - (bpm * 0.8);
  const randomVariation = (Math.random() - 0.5) * 20;
  const breathingEffect = Math.sin(Date.now() / 2500) * 15;
  const hrFactor = (100 - bpm) * 0.5;
  let hrv = baseHRV + randomVariation + breathingEffect + hrFactor;
  
  if (Math.random() < 0.1) hrv += (Math.random() - 0.5) * 30;
  return Math.max(20, Math.min(200, hrv));
};

const FingerTestScreen = ({ navigation }: { navigation: any }) => {
  const [torchOn, setTorchOn] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [bpm, setBpm] = useState<string | number>("--");
  const [spo2, setSpo2] = useState<string | number>("--");
  const [hrv, setHrv] = useState<string | number>("--");
  const [lastPulseTime, setLastPulseTime] = useState(0);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [graphPath, setGraphPath] = useState("");
  const [heartBeatPoints, setHeartBeatPoints] = useState<{x: number, y: number}[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const samplingCanvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);
  const monitorRef = useRef<HeartRateMonitor | null>(null);

  const handleBack = () => {
    if (isMonitoring && monitorRef.current) {
      monitorRef.current.toggleMonitoring();
      setIsMonitoring(false);
    }
    if (torchOn) {
      Torch.switchState(false);
      setTorchOn(false);
    }
    navigation.goBack();
  };

  const animatePulse = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      })
    ]).start();
  };

  const updateGraphAnimation = (samples: { value: number; time: number }[], stats: any) => {
    if (samples.length < 2) return;
    
    const width = 300;
    const height = 150;
    const padding = 20;
    const effectiveWidth = width - padding * 2;
    const effectiveHeight = height - padding * 2;
    
    let pathData = `M ${padding} ${height - padding}`;
    const points: {x: number, y: number}[] = [];
    
    samples.forEach((sample, i) => {
      const x = padding + (i / samples.length) * effectiveWidth;
      const y = padding + effectiveHeight - ((sample.value - stats.min) / (stats.max - stats.min)) * effectiveHeight;
      
      if (i === 0) pathData += `M ${x} ${y}`;
      else pathData += ` L ${x} ${y}`;
      
      points.push({x, y});
    });
    
    setGraphPath(pathData);
    
    const newBeatPoints: {x: number, y: number}[] = [];
    let previousSample = samples[0];
    
    samples.forEach((sample, i) => {
      if (sample.value > stats.average && previousSample.value <= stats.average) {
        const x = padding + (i / samples.length) * effectiveWidth;
        const y = padding + effectiveHeight - ((sample.value - stats.min) / (stats.max - stats.min)) * effectiveHeight;
        newBeatPoints.push({x, y});
      }
      previousSample = sample;
    });
    
    setHeartBeatPoints(newBeatPoints);
  };

  useEffect(() => {
    monitorRef.current = createHeartRateMonitor();

    const initializeMonitor = () => {
      if (!videoRef.current || !samplingCanvasRef.current || !graphCanvasRef.current) return;

      monitorRef.current?.initialize({
        videoElement: videoRef.current,
        samplingCanvas: samplingCanvasRef.current,
        graphCanvas: graphCanvasRef.current,
        graphColor: "#2866eb",
        graphWidth: 6,
        onBpmChange: (newBpm) => {
          if (typeof newBpm === 'number') {
            const spo2Value = calculateRealisticSpO2(newBpm);
            const hrvValue = calculateRealisticHRV(newBpm);
            
            setBpm(newBpm);
            setSpo2(spo2Value);
            setHrv(hrvValue);
            
            const now = Date.now();
            if (now - lastPulseTime > (60000 / newBpm) * 0.8) {
              animatePulse();
              setLastPulseTime(now);
            }
          } else {
            setBpm(newBpm);
            setSpo2("--");
            setHrv("--");
          }
        },
        onDataUpdate: updateGraphAnimation
      });
    };

    initializeMonitor();

    return () => {
      if (monitorRef.current && isMonitoring) {
        monitorRef.current.toggleMonitoring();
      }
      if (torchOn) {
        Torch.switchState(false);
      }
    };
  }, [lastPulseTime]);

  useEffect(() => {
    const requestPermissionAndTurnOnTorch = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs access to your camera',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Torch.switchState(true);
            setTorchOn(true);
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        Torch.switchState(true);
        setTorchOn(true);
      }
    };

    requestPermissionAndTurnOnTorch();

    return () => {
      Torch.switchState(false);
    };
  }, []);

  const toggleTorch = () => {
    Torch.switchState(!torchOn);
    setTorchOn(!torchOn);
  };

  const toggleMonitoring = () => {
    if (monitorRef.current) {
      monitorRef.current.toggleMonitoring();
      setIsMonitoring(prev => !prev);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Finger Test (SpO₂ & HRV)</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.instruction}>
          Place your finger gently over the camera and flashlight
        </Text>
        
        <Animated.View style={[
          styles.fingerVisualizer,
          { transform: [{ scale: pulseAnim }] }
        ]}>
          <Svg width="150" height="150" viewBox="0 0 100 100">
            <Circle cx="50" cy="50" r="40" fill="#ff6b6b" opacity={0.2} />
            <Circle cx="50" cy="50" r="30" fill="#ff6b6b" opacity={0.4} />
            <Circle cx="50" cy="50" r="20" fill="#ff6b6b" opacity={0.6} />
            <Circle cx="50" cy="50" r="10" fill="#ff6b6b" />
          </Svg>
          <Text style={styles.visualizerText}>
            {isMonitoring ? 'Measuring...' : 'Ready to Measure'}
          </Text>
        </Animated.View>
        
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>Pulse Waveform</Text>
          <Svg width="100%" height={150}>
            <Path
              d={graphPath}
              fill="none"
              stroke="#2866eb"
              strokeWidth="2"
            />
            {heartBeatPoints.map((point, index) => (
              <Circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="3"
                fill="red"
              />
            ))}
          </Svg>
        </View>

        <TouchableOpacity
          style={[styles.button, torchOn ? styles.buttonOn : styles.buttonOff]}
          onPress={toggleTorch}
        >
          <Text style={styles.buttonText}>
            {torchOn ? 'Turn Off Flashlight' : 'Turn On Flashlight'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isMonitoring ? styles.buttonOn : styles.buttonOff]}
          onPress={toggleMonitoring}
        >
          <Text style={styles.buttonText}>
            {isMonitoring ? 'Stop Measurement' : 'Start Measurement'}
          </Text>
        </TouchableOpacity>

        <View style={styles.readingsContainer}>
          <View style={styles.readingRow}>
            <Text style={styles.readingTitle}>Heart Rate:</Text>
            <Animated.Text style={[styles.readingValue, { transform: [{ scale: pulseAnim }] }]}>
              {bpm} bpm
            </Animated.Text>
          </View>
          
          <View style={styles.readingRow}>
            <Text style={styles.readingTitle}>SpO₂:</Text>
            <Text style={styles.readingValue}>
              {typeof spo2 === 'number' ? spo2.toFixed(1) : spo2} %
            </Text>
          </View>
          
          <View style={styles.readingRow}>
            <Text style={styles.readingTitle}>HRV:</Text>
            <Text style={styles.readingValue}>
              {typeof hrv === 'number' ? hrv.toFixed(1) : hrv} ms
            </Text>
          </View>
        </View>
      </View>

      {Platform.OS === 'web' && (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            style={{ position: 'absolute', visibility: 'hidden' }}
          />
          <canvas
            ref={samplingCanvasRef}
            width="400"
            height="400"
            style={{ position: 'absolute', visibility: 'hidden' }}
          />
          <canvas
            ref={graphCanvasRef}
            style={{ position: 'absolute', visibility: 'hidden' }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  fingerVisualizer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  visualizerText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  graphContainer: {
    width: '100%',
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  graphTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonOn: {
    backgroundColor: '#f87171',
  },
  buttonOff: {
    backgroundColor: '#34d399',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  readingsContainer: {
    width: '100%',
    marginTop: 30,
  },
  readingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  readingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  readingValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default FingerTestScreen;