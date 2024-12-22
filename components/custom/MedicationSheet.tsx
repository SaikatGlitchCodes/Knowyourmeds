import React from 'react';
import { StyleSheet, View } from 'react-native';

interface MedicationSheetProps{
    id: number,
    name: string,
    description: string,
    time: string,
    image: string,
}
const MedicationSheet = (medicine:MedicationSheetProps) => {
    return (
        <View>
            
        </View>
    );
}

const styles = StyleSheet.create({})

export default MedicationSheet;
