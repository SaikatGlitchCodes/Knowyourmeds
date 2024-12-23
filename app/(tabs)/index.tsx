import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, FlatList, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native';
import HorizontalCalendar from '~/components/custom/HorizontalCalendar';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import SimpleSwipable from '~/components/custom/SwipeableTasks';
import { router } from 'expo-router';
import TrueSheet from '~/components/custom/TrueSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import MedicationSheet from '~/components/custom/MedicationSheet';

const Index = () => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [tasks, setTasks] = useState([
        {
            id: '1',
            name: 'Loratadine. 10mg',
            description: '1 pill, once per day',
            time: '16:00',
            image: 'https://pics.clipartpng.com/Red_and_White_Pill_Capsule_PNG_Clipart-360.png',
        },
        {
            id: '2',
            name: 'Ibuprofen. 200mg',
            description: '2 pills, twice per day',
            time: '08:00',
            image: 'https://pics.clipartpng.com/Red_and_White_Pill_Capsule_PNG_Clipart-360.png',
        },
        {
            id: '4',
            name: 'Paracetamol. 500mg',
            description: '1 pill, every 6 hours',
            time: '12:00',
            image: 'https://pics.clipartpng.com/Red_and_White_Pill_Capsule_PNG_Clipart-360.png',
        },
        {
            id: '5',
            name: 'Ibuprofen. 200mg',
            description: '2 pills, twice per day',
            time: '08:00',
            image: 'https://pics.clipartpng.com/Red_and_White_Pill_Capsule_PNG_Clipart-360.png',
        },
        {
            id: '6',
            name: 'Paracetamol. 500mg',
            description: '1 pill, every 6 hours',
            time: '12:00',
            image: 'https://pics.clipartpng.com/Red_and_White_Pill_Capsule_PNG_Clipart-360.png',
        },
        {
            id: '7',
            name: 'Ibuprofen. 200mg',
            description: '2 pills, twice per day',
            time: '08:00',
            image: 'https://pics.clipartpng.com/Red_and_White_Pill_Capsule_PNG_Clipart-360.png',
        },
        {
            id: '8',
            name: 'Paracetamol. 500mg',
            description: '1 pill, every 6 hours',
            time: '12:00',
            image: 'https://pics.clipartpng.com/Red_and_White_Pill_Capsule_PNG_Clipart-360.png',
        }
    ]);
    const [selectedTask, setSelectedTask]=useState({});
    const sheetRef = useRef<BottomSheet>(null);
    
    const GITHUB_AVATAR_URI = 'https://avatars.githubusercontent.com/u/54322198';
    console.log('Selected date', selectedDate);
    const handlePressItem = (item:any) => {
        setSelectedTask(item);
        sheetRef.current?.snapToIndex(0);
        console.log('Pressed item: ' + item.name);
    };
    return (
        <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 50 : 0 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View className='m-2 p-2 rounded-[15px] bg-primary-foreground'>
                    <View className='flex-row items-center p-2' >
                        <Avatar className='h-14 w-14' alt="Saikat's Avatar">
                            <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
                            <AvatarFallback>
                                <Text>ZN</Text>
                            </AvatarFallback>
                        </Avatar>
                        <Text className='text-2xl ms-2 text-foreground' onPress={() => {
                            router.replace("/(auth)/welcome")
                        }}>
                            Hi, <Text className='font-semibold '>Saikat Samanta</Text> 👋
                        </Text>
                    </View>
                    <Text className='px-4 mt-2 text-3xl font-light text-foreground'>
                        "Take your medicine today for a healthier tomorrow"
                    </Text>
                    <HorizontalCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                </View>
                <SimpleSwipable tasks={tasks} handlePressItem={handlePressItem} />
                <TrueSheet ref={sheetRef} >
                    <Text>AI</Text>
                    {/* <MedicationSheet medicine={selectedTask}/> */}
                </TrueSheet>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Index;
