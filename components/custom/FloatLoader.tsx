import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useUploadStore, UPLOAD_STATUS } from '~/storage/uploadStore';

const FloatLoader = () => {
    const { status, progress, isVisible, hide } = useUploadStore();
    
    useEffect(() => {
        if (status === UPLOAD_STATUS.DONE) {
            const timer = setTimeout(hide, 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);    

    if (!isVisible) return null;

    const getMessage = () => {
        switch (status) {
            case UPLOAD_STATUS.UPLOADING: return 'Uploading...';
            case UPLOAD_STATUS.ANALYSING: return 'Analysing...';
            case UPLOAD_STATUS.DONE: return 'Complete!';
            case UPLOAD_STATUS.ERROR: return 'Error!';
            default: return 'Processing...';
        }
    };

    const isDismissible = status === UPLOAD_STATUS.DONE || status === UPLOAD_STATUS.ERROR;

    return (
        <Pressable onPress={isDismissible ? hide : undefined}>
            <View className='absolute flex-row items-center right-0 w-56 h-20 rounded-l-full bg-primary-foreground bottom-28 animate-floatload-slide border-[0.4px] border-[#bbbbbb]'>
                <AnimatedCircularProgress
                    size={70}
                    width={8}
                    fill={progress}
                    tintColor="#3b82f6"
                    backgroundColor="white">
                    {() => (
                        <Text className='text-xl text-foreground'>
                            {progress}%
                        </Text>
                    )}
                </AnimatedCircularProgress>
                <Text className='text-xl text-foreground ms-4'>{getMessage()}</Text>
            </View>
        </Pressable>
    );
};

export default FloatLoader;
