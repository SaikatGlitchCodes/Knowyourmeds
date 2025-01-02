import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
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
  const [jsonData, setJsonData] = useState<any>({});
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
  const [timesWithPills, setTimesWithPills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission Required!');
      }
    })();
  }, []);

  const methodsToCreatePrescription = [
    {
      logo: <MaterialCommunityIcons name="nfc" size={50} color="#3b82f6" />,
      name: 'NFC',
      methods: () => {
        console.log("Scan NFC")
      }
    },
    {
      logo: <MaterialCommunityIcons name="text-shadow" size={50} color="#3b82f6" />,
      name: 'Manual',
      methods: () => {
        router.push('/add-meds')
        console.log("Manual")
      }
    },
    {
      logo: <MaterialCommunityIcons name="camera-plus-outline" size={50} color="#3b82f6" />,
      name: 'AI Camera',
      methods: async () => {
        console.log("Camera button pressed");
        setLoading(true); // Show loading only after camera is pressed
        try {
          const result = await handlePhotoAndAnalysis();
          
          if (result.success) {
            setJsonData(result.datatoPrint); // Update state with the JSON object
            
            trueSheetRef?.current?.snapToIndex(1); // Open TrueSheet
            const frequency = result.datatoPrint.frequency;
            if (frequency) {
              const times = Object.entries(frequency)
                .filter(([_, value]) => value.number_of_tablets > 0)
                .map(([time, value]) => `${time}: ${value.number_of_tablets} tablet(s)`);
              setTimesWithPills(times);
            }
          }


        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false); 
        }
      }
    }
  ]

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
                <TouchableOpacity key={index} className='flex items-center justify-center rounded-lg h-28 w-28 bg-primary-foreground' onPress={method.methods}>
                  {method.logo}
                  <Text className='text-foreground'>{method.name}</Text>
                </TouchableOpacity>
              ))
            }
          </View>
        </View>
      </KeyboardAvoidingView >
    </SafeAreaView >
  );
};

export default camera;
