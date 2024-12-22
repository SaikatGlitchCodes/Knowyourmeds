import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Image, Text, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import TrueSheet from '~/components/custom/TrueSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { TextInput } from 'react-native-gesture-handler';
import { Button } from '~/components/ui/button';

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
  const trueSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);
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

  const scanNFC = () => {
    console.log("Scan NFC")
  }
  const methodsToCreatePrescription = [
    {
      logo: <MaterialCommunityIcons name="nfc" size={50} color="#3b82f6" />,
      name: 'NFC',
      methods: scanNFC
    },
    {
      logo: <MaterialCommunityIcons name="text-shadow" size={50} color="#3b82f6" />,
      name: 'Manual',
      methods: () => {
        trueSheetRef?.current?.snapToIndex(2)
        console.log("Manual")
      }
    },
    {
      logo: <MaterialCommunityIcons name="camera-plus-outline" size={50} color="#3b82f6" />,
      name: 'AI Camera',
      methods: () => {
        console.log("Prescription App")
      }
    }
  ]

  const handleSheetChanges = useCallback((index: number) => {
    console.log('Sheet changed to index:', index);
    if (index === -1) {
      setIsOpen(true);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 50 : 0 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View className='justify-center flex-1 px-10 shadow-slate-400' >
          <Text className="text-3xl text-foreground" >Medicine Prescription</Text>
          <Text className='text-foreground'>Fill your prescription using one of the methods below</Text>
          <View className='flex-row justify-between w-full mt-10'>
            {
              methodsToCreatePrescription.map((method, index) => (
                <TouchableOpacity className='flex items-center justify-center rounded-lg h-28 w-28 bg-primary-foreground' key={index} onPress={method.methods}>
                  {method.logo}
                  <Text className='text-foreground'>{method.name}</Text>
                </TouchableOpacity>
              ))
            }
          </View>
        </View>
        <TrueSheet ref={trueSheetRef} snapPoint={['10%', '100%']} handleSheetChanges={handleSheetChanges}>
          <View>
            <Text className="text-foreground">Hello</Text>
          </View>
        </TrueSheet>

        <Dialog open={isOpen} >
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Save Medicine!</DialogTitle>
              <DialogDescription>
                Cancel medication Addtion, this action cannot be undone
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className='flex-row justify-end'>
              <Button variant="outline"><Text className='text-foreground' onPress={() => { setIsOpen(false); console.log("closing") }}>Cancel</Text></Button>
              <Button variant="destructive" onPress={() => { setIsOpen(false); trueSheetRef?.current?.snapToIndex(2) }}>
                <Text className='text-white' >Proceed!</Text>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default camera;
/*
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
    </View>*/ 