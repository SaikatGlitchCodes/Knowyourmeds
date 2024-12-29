import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import * as Crypto from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

// Main method orchestrating the process
export const handlePhotoAndAnalysis = async () => {
  try {
    // Step 1: Take photo
    const photoUri = await capturePhoto();

    // Step 2: Upload to Firebase
    const uploadId = await uploadPhotoToFirebase(photoUri);

    // Step 3: Convert photo to base64
    const base64Image = await getImageBase64(photoUri);

    // Step 4: Analyze photo
    const analysisResult = await analyzeImage(base64Image);

    return {
      success: true,
      photoUri,
      uploadId,
      analysisResult,
    };
  } catch (error) {
    console.error('Error in photo process:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Helper function to capture a photo
export const capturePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [9, 16],
    quality: 1,
  });

  if (result.canceled || !result.assets.length) {
    throw new Error('Photo capture cancelled');
  }

  return result.assets[0].uri;
};

// Helper function to upload photo to Firebase
export const uploadPhotoToFirebase = async (uri) => {
  const newUuid = Crypto.randomUUID();
  const response = await fetch(uri);
  const blob = await response.blob();

  const storage = getStorage();
  const storageRef = ref(storage, newUuid);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload progress: ' + progress + '%');
      },
      reject,
      () => resolve(newUuid) // Resolve with the upload ID
    );
  });
};

// Helper function to convert image to base64
const getImageBase64 = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
  });
};

// Helper function to analyze image via API
const analyzeImage = async (base64Image) => {
  const response = await axios.post('http://192.168.6.99:3000/generate', {
    imageBase64: base64Image,
  });
  return response.data.response;
};
