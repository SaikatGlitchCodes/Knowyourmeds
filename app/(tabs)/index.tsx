import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView, ScrollView } from 'react-native';
import HorizontalCalendar from '~/components/custom/HorizontalCalendar';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

const Index = () => {
    const GITHUB_AVATAR_URI = 'https://avatars.githubusercontent.com/u/54322198';
    return (
        <SafeAreaView className='flex-1'>
            <ScrollView className='p-8'>
                <View className='flex-row items-center gap-x-3'>
                    <Avatar className='w-10 h-10' alt="Zach Nugent's Avatar">
                        <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
                        <AvatarFallback>
                            <Text>ZN</Text>
                        </AvatarFallback>
                    </Avatar>
                    <Text className='text-2xl'>Hi, <Text className='font-semibold'>Saikat</Text> 👋</Text>
                </View>
                <Text className='mt-6 text-3xl'>"Take your medicine today for a healthier tomorrow"</Text>
                <HorizontalCalendar />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default Index;
