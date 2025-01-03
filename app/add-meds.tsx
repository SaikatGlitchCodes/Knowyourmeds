import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Platform, KeyboardAvoidingView, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { Progress } from '~/components/ui/progress';
import { Button } from '~/components/ui/button';
import FormName from '~/components/questionnaire/Form_Name';
import DoseQuantityFrequency from '~/components/questionnaire/Dose_Quantity_Frequency';
import TreatmentPeriodRefills from '~/components/questionnaire/TreatmentPeriod';
import { NAV_THEME } from '~/lib/constants';
import { Formik } from 'formik';
import { medicineValidationSchema } from '~/lib/validationSchema';
import {handleTextAndNFC} from '~/util/handlingUploading_Analysis';

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
    prescription_refills: number;
    side_effects: string;
    frequency: Array<{ time: string; number_of_tablets: number }>;
    special_instructions: string;
}


const AddMeds = () => {
    const colorScheme = useColorScheme();
    const [stepIndex, setStepIndex] = useState(0);
    const themeColor = NAV_THEME[colorScheme === "light" ? "light" : "dark"];

    const initialValues: MedicineInfo = {
        medicine: 'Hello',
        uses_of_the_medicine: '',
        dose_in_mg: '',
        form: '',
        manufacturer: '',
        quantity: '',
        dangerous_or_controlled_substance: '',
        treatment_start_date: '01/01/2025',
        treatment_end_date: '01/25/2025',
        prescription_refills: 0,
        side_effects: '',
        frequency: [],
        special_instructions: '',
    };

    const addMedSteps = [
        {
            key: 1,
            title: 'Name & Form',
            component: (formikProps:any) => <FormName {...formikProps} />
        },
        {
            key: 2,
            title: 'Dose, Quantity, Frequency',
            component: (formikProps:any) => <DoseQuantityFrequency {...formikProps} />,
        },
        {
            key: 3,
            title: 'Treatment Period & Refills',
            component: (formikProps:any) => <TreatmentPeriodRefills {...formikProps} />
        }
    ]

    const goBack = () => {
        if (stepIndex > 0) {
            setStepIndex(stepIndex - 1);
            return;
        }
        router.back();
        return;
    }

    const validateCurrentStep = async (formikProps: any, currentStep: number) => {
        const { validateForm, values, setTouched } = formikProps;
        const errors = await validateForm(values);
        
        // Fields to validate per step
        const stepValidationFields: { [key: number]: string[] } = {
            0: ['medicine', 'form'],
            1: ['dose_in_mg', 'quantity', 'frequency'],
            2: ['treatment_start_date', 'treatment_end_date', 'prescription_refills']
        };
    
        // Set touched for current step fields
        const currentFields = stepValidationFields[currentStep];
        const touchedFields = currentFields.reduce((acc, field) => ({
            ...acc,
            [field]: true
        }), {});
        setTouched(touchedFields);
    
        // Check if current step fields have errors
        return !currentFields.some(field => errors[field]);
    };

    return (
        <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? 40 : 0, padding: 20, flex: 1 }}>
            <Formik
                initialValues={initialValues}
                validationSchema={medicineValidationSchema}
                onSubmit={(values) => {
                    console.log('[Values] :', values);
                    handleTextAndNFC(values);
                    router.back();
                }}
            >
                {(formikProps) => (
                    <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <View className="justify-between flex-1">
                            <View className="flex-row items-center justify-between mb-8">
                                <TouchableOpacity className="flex items-center justify-center p-3 rounded-lg bg-primary-foreground" onPress={goBack}>
                                    <MaterialIcons name="arrow-back-ios-new" size={20} color={themeColor.icon} />
                                </TouchableOpacity>
                                <Progress value={((stepIndex+1)/addMedSteps.length)*100} className="w-[60%] h-3" />
                                <Text className="text-xl text-foreground">Skip</Text>
                            </View>
                            <ScrollView style={{marginBottom: 10}} className="flex-1">
                                {addMedSteps[stepIndex].component(formikProps)}
                            </ScrollView>
                        </View>
                        <Button 
                            className='mb-1 bg-themeColor' 
                            onPress={async () => {
                                if (stepIndex === addMedSteps.length - 1) {
                                    formikProps.handleSubmit();
                                } else {
                                    const isValid = await validateCurrentStep(formikProps, stepIndex);
                                    if (isValid) {
                                        setStepIndex(stepIndex + 1);
                                    }
                                }
                            }}
                        >
                            <Text className='text-xl text-white'>
                                {stepIndex === addMedSteps.length - 1 ? 'Save' : 'Next'}
                            </Text>
                        </Button>
                    </KeyboardAvoidingView>
                )}
            </Formik>
        </SafeAreaView>
    );
};

export default AddMeds;
