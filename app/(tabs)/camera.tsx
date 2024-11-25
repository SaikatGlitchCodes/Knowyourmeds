import React, { useState, useEffect } from 'react';
import { View, Button, Image, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPkZ1LpfoJwQYE-EVvavX3V5O2zWDksNs",
  authDomain: "prescriptionmed.firebaseapp.com",
  projectId: "prescriptionmed",
  storageBucket: "prescriptionmed.appspot.com",
  messagingSenderId: "969142310795",
  appId: "1:969142310795:web:ba3b86294dbdf5f74b818e",
  measurementId: "G-G668YG8D9E"
};

// Initialize Firebase
if (!initializeApp.apps?.length) {
  initializeApp(firebaseConfig);
}

const camera = () => {
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
      }
    })();
  }, []);

  const takePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      console.log('Photo result:', result);

      if (!result.canceled && result.assets.length > 0) {
        const { uri } = result.assets[0];
        setPhoto(uri);
        console.log('Photo URI:', uri);
      } else {
        console.log('User cancelled photo action');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const uploadImage = async () => {
    if (!photo) {
      setMessage('No photo to upload');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const response = await fetch(photo);
      const blob = await response.blob();
      const filename = photo.substring(photo.lastIndexOf('/') + 1);
      const storage = getStorage();
      const storageRef = ref(storage, filename);

      const uploadTask = uploadBytesResumable(storageRef, blob);
      
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload failed:', error);
          setMessage('Upload failed: ' + error.message);
          setUploading(false);
        },
        () => {
          setUploading(false);
          setMessage('Upload successful!');
          console.log('Upload successful');
        }
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Upload failed: ' + error.message);
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Take Photo" onPress={takePhoto} />
      {photo && (
        <>
          <Image source={{ uri: photo }} style={{ width: 200, height: 200, marginTop: 20 }} />
          <Button title="Read Prescription" onPress={uploadImage} disabled={uploading} />
          {uploading && <Text>Uploading...</Text>}
          {message ? <Text>{message}</Text> : null}
        </>
      )}
    </View>
  );
};

export default camera;
