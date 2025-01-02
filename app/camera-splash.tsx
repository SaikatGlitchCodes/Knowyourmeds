import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { handlePhotoAndAnalysis } from '~/util/handlingCameraUpload'
import GifImage from '@lowkey/react-native-gif';

export default function cameraSplash() {

    return (
        <SafeAreaView>
            <GifImage
                source={{
                    uri:
                        'https://i.pinimg.com/originals/73/92/b6/7392b68031f0b223514e1779be78cce5.gif',
                }}
                style={{
                    width: 100,
                    height: 100,
                }}
                resizeMode={'cover'}
            />;ƒ
        </SafeAreaView>
    )
}