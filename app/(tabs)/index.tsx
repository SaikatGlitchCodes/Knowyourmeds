import React, { useEffect, useRef, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native';
import HorizontalCalendar from '~/components/custom/HorizontalCalendar';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import SimpleSwipable from '~/components/custom/SwipeableTasks';
import { router } from 'expo-router';
import TrueSheet from '~/components/custom/TrueSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import MedicationSheet from '~/components/custom/MedicationSheet';
import { useMedicineStore } from '~/storage/medicineStore';
import { processFrequencies } from '~/util/splitSchedule';
import calculateCompletion from '~/util/calculateProgress';


const Index = () => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedTask, setSelectedTask] = useState({});
    const sheetRef = useRef<BottomSheet>(null);  
    const medicines = useMedicineStore((state) => state.medicines);
    
    const GITHUB_AVATAR_URI = 'https://avatars.githubusercontent.com/u/54322198';

    const handlePressItem = (item: any) => {
        const percentageCal = calculateCompletion(item.treatment_start_date, item.treatment_end_date);
        setSelectedTask({...item, percentageCal});
        sheetRef.current?.snapToIndex(0);
    };
    
    const handleClose =()=>{
        sheetRef.current?.close();
    }
    return (
        <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 40 : 0}}>
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
                        <Text className='text-2xl ms-2 text-foreground'>
                            Hi,
                            <Text className='font-semibold '>Saikat Samanta</Text> 👋
                        </Text>
                    </View>
                    <Text className='mt-2 text-3xl font-light text-center text-foreground'>
                        "Take your medicine today for a healthier tomorrow"
                    </Text>
                    <HorizontalCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                </View>
                <SimpleSwipable tasks={processFrequencies(medicines)} handlePressItem={handlePressItem} />
                <TrueSheet ref={sheetRef} snapPoint={['52%', '100%']}>
                    <MedicationSheet medicine={selectedTask} handleClose={handleClose}/>
                </TrueSheet>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Index;
