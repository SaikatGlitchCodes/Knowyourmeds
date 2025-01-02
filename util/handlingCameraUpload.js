import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Crypto from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import BottomSheet from '@gorhom/bottom-sheet';
import TrueSheet from '~/components/custom/TrueSheet';
export const handlePhotoAndAnalysis = async () => {
   
  try {
    // Step 1: Take photo
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (result.canceled || !result.assets.length) {
      throw new Error('Photo capture cancelled');
    }

    const { uri } = result.assets[0];

    // Step 2: Upload to Firebase
    const newUuid = Crypto.randomUUID();
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const storage = getStorage();
    const storageRef = ref(storage, newUuid);
    
    // Create promise for upload
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, blob);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload progress: ' + progress + '%');
        },
        reject,
        resolve
      );
    });

    await uploadPromise;

    // Step 3 & 4: Convert to base64 and analyze
    const base64Image = await getImageBase64(uri);
    const analysisResponse = await axios.post('https://medicineschedulerai.onrender.com/generate/image', {
      imageBase64: base64Image,
    });
    console.log('')
    const stuff = analysisResponse.data.response
    const cleanInput = stuff.replace(/```json|```/g, '').trim();

    const data=JSON.parse(cleanInput)
    console.log(data.patientname)
    return {
      success: true,
      photoUri: uri,
      uploadId: newUuid,
      analysisResult: analysisResponse.data.response,
      finalData: console.log(cleanInput),
      datatoPrint: data,
      loadingComp:  <ActivityIndicator size="large" />
    };

  } catch (error) {
    console.error('Error in photo process:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

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