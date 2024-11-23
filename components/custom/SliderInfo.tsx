import React, { useState } from 'react';
import { Animated, Text, View, StyleSheet, Image } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const SwipeableCard = () => {
    const [translationX, setTranslationX] = useState(new Animated.Value(0));

    const handleGestureEvent = Animated.event(
        [{ nativeEvent: { translationX } }],
        { useNativeDriver: true }
    );

    const handleGestureEnd = ({ nativeEvent }: any) => {
        if (nativeEvent.translationX > 100) {
            // Right swipe action: Know More
            Animated.timing(translationX, {
                toValue: 200, // Fully swipe to the right
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                alert("Know more about Loratadine 10mg");
                resetPosition();
            });
        } else if (nativeEvent.translationX < -100) {
            // Left swipe action: Close
            Animated.timing(translationX, {
                toValue: -200, // Fully swipe to the left
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                alert("Card closed");
                resetPosition();
            });
        } else {
            // If not swiped far enough, reset
            resetPosition();
        }
    };

    const resetPosition = () => {
        Animated.timing(translationX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    return (
        <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onHandlerStateChange={({ nativeEvent }) => {
                if (nativeEvent.state === State.END) {
                    handleGestureEnd({ nativeEvent });
                }
            }}
        >
            <Animated.View
                style={[
                    {
                        transform: [{ translateX: translationX }],
                    },
                ]}
            >
                <View className='flex-row items-center p-2 border-[1px] border-gray-400 gap-x-6 rounded-3xl px-5 h-20'>
                    <Image className='h-14 w-14' source={{ uri: 'https://pics.clipartpng.com/Red_and_White_Pill_Capsule_PNG_Clipart-360.png' }} />
                    <View className=''>
                        <Text className='text-muted-foreground'>1 pill, once per day</Text>
                        <Text className='text-xl- text-foreground'>Loratadine 10mg</Text>
                        <Text className='text-muted-foreground'> 16:00 pm </Text>
                    </View>
                </View>
                
            </Animated.View>

        </PanGestureHandler>
    );
};

export default SwipeableCard;
