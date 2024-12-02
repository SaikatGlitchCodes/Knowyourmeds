import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import Swiper from 'react-native-swiper'
import { Button } from '~/components/ui/button'

const WelcomeScreens = [
    {
        title: 'Welcome to',
        subtitle: 'Your #1 Free Medicine Scheduling App',
        image: require('~/assets/images/welcome1.png'),
    },
    {
        title: 'Discover',
        subtitle: 'Unlimited Offers',
        image: null,
    },
    {
        title: 'Customize',
        subtitle: 'Your Experience',
        image: null,
    }
]
export default function welcome() {
    const [activeIndex, setActiveIndex] = useState(1);
    const swiperRef = useRef<Swiper>(null);
    const lastIndex = activeIndex === WelcomeScreens.length-1;
    return (
        <SafeAreaView className='items-center justify-between flex-1 h-hull'>
            <TouchableOpacity className='flex items-end justify-end w-full p-5'>
                <Text className='text-black text-md' onPress={() => { router.replace("/(tabs)") }}>Skip</Text>
            </TouchableOpacity>
            <Swiper
                ref={swiperRef}
                onIndexChanged={index=> setActiveIndex(index)}
                loop={false}
                dot={<View className='w-10 h-2 mx-1 bg-gray-400 rounded-full' />}
                activeDot={<View className='w-10 h-2 mx-1 bg-[#3b82f6] rounded-full' />}
            >
                {
                    WelcomeScreens.map((screen, index) => (
                        <View key={index} className='p-10'>
                            <Text className='text-6xl text-center'>{screen.title}</Text>

                            <Text className='mt-2 text-xl text-center'>{screen.subtitle}</Text>
                            {
                                screen.image && <Image source={screen?.image} className='object-cover w-full mt-4 h-60' />
                            }

                        </View>
                    ))
                }
            </Swiper>
            <Button onPress={()=>lastIndex?router.replace('/(tabs)'):swiperRef.current?.scrollBy(1)} className='w-[90%] mb-4 bg-[#3b82f6]'><Text className='font-bold text-white'>{lastIndex ?'Let\'s Go 🎉': 'Get Started' }</Text></Button>
            <Text className='mb-2 text-gray-600 text-md '>Completely free with full data privacy</Text>
        </SafeAreaView>
    )
}