import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Platform, KeyboardAvoidingView, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMedicineStore } from '~/storage/medicineStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { Progress } from '~/components/ui/progress';
import { Button } from '~/components/ui/button';
import FormName from '~/components/questionnaire/Form_Name';
import DoseQuantityFrequency from '~/components/questionnaire/Dose_Quantity_Frequency';
import TreatmentPeriodRefills from '~/components/questionnaire/TreatmentPeriod';
import { NAV_THEME } from '~/lib/constants';

interface MedicineInfo {
    medicine: string;
    uses_of_the_medicine: string;
    dose_in_mg: string;
    form: string;
    manufacturer: string;
    quantity: string;
    dangerous_or_controlled_substance: string;
    treatment_start_date: string;
    treatment_end_date: string;
    prescription_refills: string;
    side_effects: string;
    frequency: Array<{ time: string; number_of_tablets: number }>;
    special_instructions: string;
}


const AddMeds = () => {
    const colorScheme = useColorScheme();
    const [medicineInfo, setMedicineInfo] = useState<MedicineInfo>({
        medicine: '',
        uses_of_the_medicine: '',
        dose_in_mg: '',
        form: '',
        manufacturer: '',
        quantity: '',
        dangerous_or_controlled_substance: '',
        treatment_start_date: '01/01/2025',
        treatment_end_date: '01/25/2025',
        prescription_refills: '',
        side_effects: '',
        frequency: [],
        special_instructions: '',
    });
    console.log('Medicine info', medicineInfo);
    const [stepIndex, setStepIndex] = useState(0);
    const themeColor = NAV_THEME[colorScheme === "light" ? "light" : "dark"];

    const addMedicine = () => {
        useMedicineStore.getState().addMedicine({
            ...medicineInfo,
            medicine: 'Amoxicillin',
            uses_of_the_medicine: 'Amoxicillin is an antibiotic used to treat bacterial infections such as ear infections and pneumonia.',
            dose_in_mg: '250',
            form: 'Capsule',
            manufacturer: 'Cipla',
            quantity: '30',
            dangerous_or_controlled_substance: 'no',
            treatment_start_date: '2025-01-12',
            treatment_end_date: '2025-01-18',
            prescription_refills: '0',
            side_effects: '<ul><li>Nausea</li><li>Diarrhea</li><li>Allergic reaction</li><li>Rash</li></ul>',
            frequency: [
                { time: '08:00', number_of_tablets: 1 },
                { time: '20:00', number_of_tablets: 1 },
            ],
            special_instructions: 'Complete the full course as prescribed.',
        });
        console.log('Added Medicine', useMedicineStore.getState().medicines);
    };

    const addMedSteps = [
        {
            key: 1,
            title: 'Name & Form',
            component: <FormName medicineInfo={medicineInfo} setMedicineInfo={setMedicineInfo} />
        },
        {
            key: 2,
            title: 'Dose, Quantity, Frequency',
            component: <DoseQuantityFrequency medicineInfo={medicineInfo} setMedicineInfo={setMedicineInfo} />,
        },
        {
            key: 3,
            title: 'Treatment Period & Refills',
            component: <TreatmentPeriodRefills medicineInfo={medicineInfo} setMedicineInfo={setMedicineInfo} />
        }
    ]

    const nextStep = () => {
        if (stepIndex === addMedSteps.length - 1) {
            // addMedicine();
            return;
        }  // TODO: Add validation and save to store here
        if (stepIndex < addMedSteps.length - 1) {
            setStepIndex(stepIndex + 1)
        }

    }
    const goBack = () => {
        if (stepIndex > 0) {
            setStepIndex(stepIndex - 1);
            return;
        }
        router.back();
        return;
    }

    return (
        <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? 40 : 0, padding: 20, flex: 1 }}>
            <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
                    <View className="justify-between flex-1">
                        <View className="flex-row items-center justify-between mb-8">
                            <TouchableOpacity className="flex items-center justify-center p-3 rounded-lg bg-primary-foreground" onPress={goBack}>
                                <MaterialIcons name="arrow-back-ios-new" size={20} color={themeColor.icon} />
                            </TouchableOpacity>
                            <Progress value={50} className="w-[60%] h-3" />
                            <Text className="text-xl text-foreground">Skip</Text>
                        </View>
                        <ScrollView style={{marginBottom: 10}} className="flex-1">
                        {addMedSteps[stepIndex].component}
                    </ScrollView>
                </View>
                <Button className='mb-1 bg-themeColor' onPress={nextStep}><Text className='text-xl text-white'>{stepIndex === addMedSteps.length - 1 ? 'Save' : 'Next'}</Text>
                </Button>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AddMeds;
