import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase/app';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Dialog, DialogFooter, DialogContent, DialogHeader, DialogDescription, DialogTitle } from '~/components/ui/dialog';
import TrueSheet from '~/components/custom/TrueSheet';
import { firebaseConfig } from '../../util/firebaseConfig'
import BottomSheet from '@gorhom/bottom-sheet';
import { Button } from '~/components/ui/button';
import {handlePhotoAndAnalysis} from '~/util/handlingCameraUpload'

// Initialize Firebase
if (!initializeApp.apps?.length) {
  initializeApp(firebaseConfig);
}

const camera = () => {
  const trueSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission Required!');
      }
    })();
  }, []);

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
        trueSheetRef?.current?.snapToIndex(1)
        console.log("Manual")
      }
    },
    {
      logo: <MaterialCommunityIcons name="camera-plus-outline" size={50} color="#3b82f6" />,
      name: 'AI Camera',
      methods: () => {
        handlePhotoAndAnalysis();
        console.log("Prescription App")
      }
    }
  ]

  const handleSheetChanges = useCallback((index: number) => {
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
              <Button variant="outline"><Text className='text-foreground' onPress={() => { setIsOpen(false);}}>Cancel</Text></Button>
              <Button variant="destructive" onPress={() => { setIsOpen(false); trueSheetRef?.current?.snapToIndex(2) }}>
                <Text className='text-white' >Proceed!</Text>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </KeyboardAvoidingView >
    </SafeAreaView >
  );
};

export default camera;
