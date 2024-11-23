import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView, ScrollView } from 'react-native';
import HorizontalCalendar from '~/components/custom/HorizontalCalendar';
import SwipeableCard from '~/components/custom/SliderInfo';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Index = () => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [tasks, setTasks] = useState([
        {
            id: '1',
            name: 'Loratadine. 10mg',
            description: '1 pill, once per day',
            time: '16:00 pm',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEOt0A23mzyuU8Z_N2qcOSKwvhfU1CZy8X8w&s',
        },
        {
            id: '2',
            name: 'Ibuprofen. 200mg',
            description: '2 pills, twice per day',
            time: '08:00 am',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEOt0A23mzyuU8Z_N2qcOSKwvhfU1CZy8X8w&s',
        },
        {
            id: '3',
            name: 'Paracetamol. 500mg',
            description: '1 pill, every 6 hours',
            time: '12:00 pm',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEOt0A23mzyuU8Z_N2qcOSKwvhfU1CZy8X8w&s',
        },
    ]);
    const GITHUB_AVATAR_URI = 'https://avatars.githubusercontent.com/u/54322198';
    console.log('Selected date', selectedDate);
    return (
        <SafeAreaView className='flex-1 '>
            <View className='p-4'>
                <View className='flex-row items-center gap-x-3'>
                    <Avatar className='w-10 h-10' alt="Zach Nugent's Avatar">
                        <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
                        <AvatarFallback>
                            <Text>ZN</Text>
                        </AvatarFallback>
                    </Avatar>
                    <Text className='text-2xl text-foreground'>Hi, <Text className='font-semibold '>Saikat</Text> 👋</Text>
                </View>
                <Text className='mt-6 text-3xl text-card-foreground'>"Take your medicine today for a healthier tomorrow"</Text>
                <HorizontalCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                <GestureHandlerRootView className='flex-1'>
                   <SwipeableCard/>
                </GestureHandlerRootView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default Index;
