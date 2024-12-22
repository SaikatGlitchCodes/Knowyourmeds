import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Image, Text, SafeAreaView, KeyboardAvoidingView, Platform, Touchable, TouchableOpacity, Linking } from 'react-native';
import { Button } from '~/components/ui/button';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Dialog, DialogFooter, DialogContent, DialogHeader, DialogDescription, DialogTitle } from '~/components/ui/dialog';
import TrueSheet from '~/components/custom/TrueSheet';
import GenerateContent from './GenerateContent'
import { v4 as uuidv4 } from 'uuid';
import * as Crypto from 'expo-crypto';

import BottomSheet from '@gorhom/bottom-sheet';
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
  const manualtrueSheetRef = useRef<BottomSheet>(null);
  const NFCtrueSheetRef = useRef<BottomSheet>(null);
  const cameratrueSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [uuid, setUuid] = useState('');
 

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
      const newUuid = Crypto.randomUUID();
      setUuid(newUuid); // Save UUID in state
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
      
      const storage = getStorage();
      const storageRef = ref(storage, uuid);

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
const plink = `https://firebasestorage.googleapis.com/v0/b/prescriptionmed.appspot.com/o/${uuid}?alt=media`
  const methodsToCreateP = [
    {
      logo: <MaterialCommunityIcons name="camera-plus-outline" size={50} color="white" />,
      name: 'AI Camera',
      methods: () => {
        cameratrueSheetRef?.current?.snapToIndex(1)
        console.log("camera")
      },
    },
    {
      logo: <MaterialCommunityIcons name="nfc" size={50} color="white" />,
      name: 'NFC',
      methods: () => {
        NFCtrueSheetRef?.current?.snapToIndex(1)
        console.log("nfc")
      },
    },
    {
      logo: <MaterialCommunityIcons name="text-shadow" size={50} color="white" />,
      name: 'Manual',
      methods: () => {
        manualtrueSheetRef?.current?.snapToIndex(1)
        console.log("manual")
      },
    },
  ]
  const handleSheetChanges = useCallback((index: number) => {
    console.log('Sheet changed to index:', index);
    if (index === -1) {
      setIsOpen(true)
    }
  }, []);
  console.log("index value", manualtrueSheetRef?.current)
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 50 : 0 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View className="justify-center flex-1 px-10 shadow-slate-400" >
          <Text className="text-foreground text-3xl">Medicine
            Prescription</Text>
          <Text className="text-foreground">Add your medication by choosing one of the methods below</Text>
          <View className="flex-row justify-between mt-24">
            {
              methodsToCreateP.map((method, index) => (
                <TouchableOpacity className="items-center justify-center flex h-28 w-28 bg-primary-foreground " key={index} onPress={method.methods}>
                  {method.logo}
                  <Text className="text-foreground">{method.name}</Text>
                </TouchableOpacity>

              ))
            }
          </View>
        </View>
        <TrueSheet ref={manualtrueSheetRef} snapPoint={['10%', "100%"]} handleSheetChanges={handleSheetChanges}>
          <View>
            <Text className="text-foreground">Manual Input</Text>
          </View>
        </TrueSheet>

        <TrueSheet ref={cameratrueSheetRef} snapPoint={['10%', "100%"]} handleSheetChanges={handleSheetChanges}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity className="items-center justify-center flex h-28 w-28 bg-primary-foreground rounded-sm" onPress={takePhoto}><Text className="text-foreground"><MaterialCommunityIcons name="camera-plus-outline" size={50} color="white" /></Text></TouchableOpacity>
            {photo && (
              <>
                {/* <Image source={{ uri: photo }} style={{ width: 200, height: 200, marginTop: 20 }} /> */}
                <TouchableOpacity className="items-center justify-center flex h-12 w-48 bg-slate-400 mt-3 rounded-sm" onPress={uploadImage} disabled={uploading}><Text>Upload Prescription</Text></TouchableOpacity>
                {uploading && <Text className='text-foreground mt-3'>Uploading to server...</Text>}
                {message ? <Text className='text-foreground mt-3'>{message}</Text> : null}
              </>
            )}
            {message && (
              <>
                <GenerateContent imageUrl={plink}/>
              </>
            )}
          </View>
        </TrueSheet>
        <TrueSheet ref={NFCtrueSheetRef} snapPoint={['10%', "100%"]} handleSheetChanges={handleSheetChanges}>
          <View>
            <Text className="text-foreground">NFC Input</Text>
          </View>
        </TrueSheet>


        {/* <Dialog open={isOpen}>


          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Cancel Add</DialogTitle>
              <DialogDescription>
                Cancel Medication Addition. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className='flex-row justify-end'>
              <Button variant="outline" onPress={() => {
                setIsOpen(false)
              }}><Text className='text-foreground'>Keep going</Text></Button>
              <Button variant="destructive" >
                <Text className='text-white' >Delete!</Text>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default camera;

// <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Button title="Take Photo" onPress={takePhoto} />
//       {photo && (
//         <>
//           <Image source={{ uri: photo }} style={{ width: 200, height: 200, marginTop: 20 }} />
//           <Button title="Read Prescription" onPress={uploadImage} disabled={uploading} />
//           {uploading && <Text>Uploading...</Text>}
//           {message ? <Text>{message}</Text> : null}
//         </>
//       )}
//     </View>