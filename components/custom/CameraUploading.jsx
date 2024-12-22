import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { handlePhotoAndAnalysis } from '../../util/handlingCameraUpload';

const CameraAnalyzer = ({ onComplete, onError }) => {
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const handleCapture = useCallback(async () => {
    try {
      setStatus('processing');
      const result = await handlePhotoAndAnalysis((statusUpdate) => {
        setStatus(statusUpdate.status);
        setMessage(statusUpdate.message);
        if (statusUpdate.progress) {
          setProgress(statusUpdate.progress);
        }
      });

      if (result.success) {
        onComplete?.(result);
      } else {
        onError?.(result.error);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
      onError?.(error.message);
    }
  }, [onComplete, onError]);

  const renderStatus = () => {
    switch (status) {
      case 'processing':
      case 'uploading':
      case 'analyzing':
        return (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.statusText}>{message}</Text>
            {progress > 0 && (
              <Text style={styles.progressText}>{`${progress}%`}</Text>
            )}
          </View>
        );
      case 'error':
        return (
          <Text style={styles.errorText}>{message}</Text>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleCapture}
        disabled={status === 'processing'}
      >
        <Text style={styles.buttonText}>
          Take Photo & Analyze
        </Text>
      </TouchableOpacity>
      {renderStatus()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  statusText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
  progressText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    marginTop: 10,
    color: 'red',
    fontSize: 14,
  },
});

export default CameraAnalyzer;