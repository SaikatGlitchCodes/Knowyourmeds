import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native';
import HorizontalCalendar from '~/components/custom/HorizontalCalendar';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import SimpleSwipable from '~/components/custom/SwipeableTasks';


const Index = () => {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [tasks, setTasks] = useState([
        {
            id: '1',
            name: 'Loratadine. 10mg',
            description: '1 pill, once per day',
            time: '16:00',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEOt0A23mzyuU8Z_N2qcOSKwvhfU1CZy8X8w&s',
        },
        {
            id: '2',
            name: 'Ibuprofen. 200mg',
            description: '2 pills, twice per day',
            time: '08:00',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEOt0A23mzyuU8Z_N2qcOSKwvhfU1CZy8X8w&s',
        },
        {
            id: '3',
            name: 'Paracetamol. 500mg',
            description: '1 pill, every 6 hours',
            time: '12:00',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEOt0A23mzyuU8Z_N2qcOSKwvhfU1CZy8X8w&s',
        },
    ]);
    const GITHUB_AVATAR_URI = 'https://avatars.githubusercontent.com/u/54322198';
    console.log('Selected date', selectedDate);

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 50 : 0 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View className='flex-row items-center px-2'>
                    <Avatar className='w-16 h-16' alt="Saikat's Avatar">
                        <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
                        <AvatarFallback>
                            <Text>ZN</Text>
                        </AvatarFallback>
                    </Avatar>
                    <Text className='text-3xl ms-5 text-foreground'>
                        Hi, <Text className='font-semibold '>Saikat</Text> 👋
                    </Text>
                </View>
                <Text className='px-4 mt-4 text-4xl text-foreground'>
                    "Take your medicine today for a healthier tomorrow"
                </Text>
                <HorizontalCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                <SimpleSwipable tasks={tasks}/>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Index;
