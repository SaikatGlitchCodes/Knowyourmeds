import React from 'react';
import { View, Text } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const FloatLoader = () => {
    return (
        <View className='absolute flex-row items-center right-0 w-56 h-20 rounded-l-full bg-[#ffffff] bottom-28 animate-floatload-slide border-[0.4px] border-[#bbbbbb]'>
            <AnimatedCircularProgress
                size={70}
                width={8}
                fill={60}
                tintColor="#3b82f6"
                backgroundColor="white">
                {
                    () => (
                            <Text className='text-xl text-[#3b82f6]'>
                                {50}%
                            </Text>
                    )
                }
            </AnimatedCircularProgress>
            <Text className='text-xl text-gray-600 ms-4'>Analysing...</Text>
        </View>
    );
}

export default FloatLoader;
