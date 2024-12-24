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
import { handlePhotoAndAnalysis } from '~/util/handlingCameraUpload';

// Initialize Firebase
if (!initializeApp.apps?.length) {
  initializeApp(firebaseConfig);
}

const camera = () => {
  const trueSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [jsonData, setJsonData] = useState("");
  const [patientname, setPatientname] = useState("");
  const [medicine, setMedicine] = useState("");
  const [dose, setDose] = useState("");
  const [form, setForm] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [quantity, setQuantity] = useState("");
  const [taken, setTaken] = useState(false);
  const [dangerousOrControlledSubstance, setDangerousOrControlledSubstance] = useState("");
  const [frequency, setFrequency] = useState({});
  const [specialInstructions, setSpecialInstructions] = useState("");


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
      methods: async () => {
        console.log("Camera button pressed");
        try {
          const result = await handlePhotoAndAnalysis();
          if (result.success) {
            setJsonData(result.datatoPrint); // Update state with the JSON object
            trueSheetRef?.current?.snapToIndex(1); // Open TrueSheet
            setPatientname(jsonData.patientname);
            setMedicine(jsonData.medicine);
            setDose(jsonData.dose);
            setForm(jsonData.form);
            setManufacturer(jsonData.manufacturer);
            setQuantity(jsonData.quantity);
            setTaken(jsonData.taken);
            setDangerousOrControlledSubstance(jsonData.dangerousorcontrolledsubstance);
            setFrequency(jsonData.frequency);
            setSpecialInstructions(jsonData.special_instructions);

          }


        } catch (error) {
          console.error("Error:", error);
        }
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
            <Text className='text-foreground'>Patient Name: {jsonData.patientname}</Text>
            <Text className='text-foreground'>Medicine: {jsonData.medicine}</Text>
            <Text className='text-foreground'>Dose: {jsonData.dose}</Text>
            <Text className='text-foreground'>Form: {jsonData.form}</Text>
            <Text className='text-foreground'>Manufacturer: {jsonData.manufacturer}</Text>
            <Text className='text-foreground'>Quantity: {jsonData.quantity}</Text>
            <Text className='text-foreground'>Taken: {jsonData.taken ? "Yes" : "No"}</Text>
            <Text className='text-foreground'>Dangerous or Controlled Substance: {jsonData.dangerousOrControlledSubstance}</Text>
            {/* <Text className='text-foreground'>Frequency: {frequency}</Text> */}
            <Text className='text-foreground'>Special Instructions: {jsonData.special_instructions}</Text>
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
      </KeyboardAvoidingView >
    </SafeAreaView >
  );
};

export default camera;
