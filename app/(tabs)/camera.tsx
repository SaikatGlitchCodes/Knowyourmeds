import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase/app';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { firebaseConfig } from '../../util/firebaseConfig';
import { handlePhoto } from '~/util/handlingUploading_Analysis';
import { useRouter } from 'expo-router';
import { Overlay } from 'react-native-elements';
import LottieView from 'lottie-react-native';
import NFCReader from '~/components/custom/NFCReader';

// Initialize Firebase
if (!initializeApp.apps?.length) {
  initializeApp(firebaseConfig);
}

const camera = () => {
  const router = useRouter();
  const [nfcVisible, setNfcVisible] = useState(false);

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
        setNfcVisible(true)
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
        const data = await handlePhoto()
        router.push({
          pathname: '/add-meds',
          params: { prefillData: data.analysisResult }
        })
        console.log("Prescription App")
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

          <Overlay isVisible={nfcVisible} onBackdropPress={() => setNfcVisible(false)}>
          {/* <LottieView source={require('~/assets/nfcLottie.json')} autoPlay loop  style={{ width: 200, height: 200 }}
        resizeMode="cover"/> */}

        <NFCReader />
          </Overlay>
        </View>
      </KeyboardAvoidingView >
    </SafeAreaView >
  );
};

export default camera;