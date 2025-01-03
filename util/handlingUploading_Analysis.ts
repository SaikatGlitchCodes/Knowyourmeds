import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import * as Crypto from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useUploadStore, UPLOAD_STATUS } from '~/storage/uploadStore';

import { useMedicineStore } from '~/storage/medicineStore';

interface AnalysisResponse {
  success: boolean;
  photoUri?: string;
  uploadId?: string;
  analysisResult?: string;
  datatoPrint?: any;
  error?: string;
}

const uploadToFirebase = async (uri: string, setProgress: (progress: number) => void) => {
  console.log('Starting Firebase upload');
  const startTime = Date.now();
  const newUuid = Crypto.randomUUID();
  const response = await fetch(uri);
  const blob = await response.blob();

  const storage = getStorage();
  const storageRef = ref(storage, newUuid);

  return new Promise<string>((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(progress));
        console.log(`Upload progress: ${Math.round(progress)}%`);
      },
      (error) => {
        console.error('Upload failed:', error);
        reject(error);
      },
      () => {
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`Upload completed in ${duration}s`);
        resolve(newUuid);
      }
    );
  });
};

const analyzeImage = async (base64Image: string) => {
  const response = await axios.post('https://medicineschedulerai.onrender.com/generate/image', {
    imageBase64: base64Image,
  });
  const cleanInput = response.data.response.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanInput);
};

export const handlePhoto = async (): Promise<AnalysisResponse> => {
  const { show, setStatus, setProgress, hide } = useUploadStore.getState();
  const startTime = Date.now();
  console.log('Starting photo capture and analysis');

  try {
    console.info('Launching camera');
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (result.canceled || !result.assets.length) {
      console.warn('Photo capture cancelled by user');
      throw new Error('Photo capture cancelled');
    }

    const { uri } = result.assets[0];
    console.info(`Photo captured: ${uri.substring(uri.length - 20)}`);
    
    show();
    setStatus(UPLOAD_STATUS.UPLOADING);

    const uploadId = await uploadToFirebase(uri, setProgress);

    console.info('Starting image analysis');
    setStatus(UPLOAD_STATUS.ANALYSING);
    setProgress(50);

    const base64Image = await getImageBase64(uri);
    const analysisData = await analyzeImage(base64Image);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`Process completed in ${duration}s`);

    setStatus(UPLOAD_STATUS.DONE);
    setProgress(100);

    return {
      success: true,
      photoUri: uri,
      uploadId,
      analysisResult: JSON.stringify(analysisData),
      datatoPrint: analysisData,
    };

  } catch (error) {
    console.log('Process failed:', error);
    setStatus(UPLOAD_STATUS.ERROR);
    console.error('Error in photo process:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const handleTextAndNFC = async (data: any): Promise<AnalysisResponse> => {
  const { show, setStatus, setProgress } = useUploadStore.getState();

  const extractObject = (inputString: string) => {
    const objectStartIndex = inputString.indexOf('{');
    const objectEndIndex = inputString.lastIndexOf('}');
    if (objectStartIndex === -1 || objectEndIndex === -1) {
      throw new Error('No valid JSON object found in the string.');
    }
    const jsonString = inputString.slice(objectStartIndex, objectEndIndex + 1);
    return JSON.parse(jsonString);
  };

  try {
    show();
    setStatus(UPLOAD_STATUS.ANALYSING);
    setProgress(50);

    const response = await axios.post('https://medicineschedulerai.onrender.com/generate/textinput', data);
    
    // Clean the input and extract the object
    const cleanInput = response.data.response.replace(/```json|```/g, '').trim();
    const parsedData = extractObject(cleanInput);

    setStatus(UPLOAD_STATUS.DONE);
    setProgress(100);
    useMedicineStore.getState().addMedicine(parsedData);

    return {
      success: true,
      analysisResult: JSON.stringify(parsedData),
      datatoPrint: parsedData,
    };

  } catch (error) {
    setStatus(UPLOAD_STATUS.ERROR);
    console.error('Error in text process:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

const getImageBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64 = reader.result?.toString().split(',')[1];
      if (base64) resolve(base64);
      else reject(new Error('Failed to convert image to base64'));
    };
    reader.onerror = reject;
  });
};