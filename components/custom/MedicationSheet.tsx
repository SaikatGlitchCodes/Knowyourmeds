import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import moment from 'moment';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { ScrollView } from 'react-native-gesture-handler';
import iconRef from '~/util/MedicineIcon';
import { useRouter } from 'expo-router';
import { frequencyArray } from '~/util/splitSchedule';
interface MedicationSheetProps {
    medicine: {
        id: number,
        name: string,
        description: string,
        time: string,
        image: string,
    }
}

const MedicationSheet = ({ medicine, handleClose }: any) => {
    const router = useRouter();
    const [viewTime, setViewTime] = React.useState(false);
    const calculateDaysBetween = (startDate: string, endDate: string) => {
        const start = moment(startDate, 'MM/DD/YYYY'); // Parse start date
        const end = moment(endDate, 'MM/DD/YYYY'); // Parse end date

        // Check if the dates are valid
        if (!start.isValid() || !end.isValid()) {
            return "Invalid date format";
        }

        return end.diff(start, 'days'); // Calculate difference in days
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View>
                <View className='flex-row items-center justify-between'>
                    <Text className='mb-2 text-3xl font-semibold text-foreground'>
                        {medicine.medicine} {medicine.dose_in_mg} mg
                    </Text>
                    <AntDesign onPress={handleClose} name="close" size={24} color="black" />
                </View>
                <Text className='text-xl text-md text-muted-foreground'>{medicine.uses_of_the_medicine}</Text>
            </View>

            <View className='mt-3'>
                <Text className='text-2xl text-foreground'>Schedule</Text>
                <View className='flex-row items-center mt-2 gap-x-4'>
                    <TouchableOpacity onPress={() => setViewTime(!viewTime)} className='flex items-center justify-center rounded-lg h-11 w-11 bg-themeColor'>
                        <AntDesign name="plus" size={30} color="white" />
                    </TouchableOpacity>
                    {
                        medicine.frequency?.map((time: any, index: number) => {
                            return (
                                <TouchableOpacity key={index} className='flex items-center px-5 py-2 rounded-lg h-11 bg-primary-foreground'>
                                    <Text className='text-xl font-light text-foreground'>{time.time}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                <ScrollView horizontal className={`mt-4 pb-3 ${viewTime ? 'block' : 'hidden'}`}>
                    {
                        frequencyArray.map((frequency, index) => (
                            <TouchableOpacity key={index} className='flex items-center px-5 py-2 rounded-lg h-11 bg-primary-foreground me-3'>
                                <Text className='text-xl font-light text-foreground'>{frequency.time}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            </View>
            <View className='p-5 my-4 rounded-xl bg-primary-foreground'>
                <View className='flex-row items-center gap-x-4'>
                    {iconRef(medicine.form, 32)}
                    <Text className='text-2xl text-foreground'>{medicine?.form}</Text>
                </View>

                <View className='flex-row justify-between mt-4 gap-x-4'>
                    <View>
                        <Text className='font-light text-muted-foreground'>Duration</Text>
                        <Text className='text-xl font-medium text-foreground'>{calculateDaysBetween(medicine.treatment_start_date, medicine.treatment_end_date)} days</Text>
                    </View>
                    <View>
                        <Text className='font-light text-muted-foreground'>Dose</Text>
                        <Text className='text-xl font-medium text-foreground'>{medicine?.dose_in_mg}mg</Text>
                    </View>
                    <View>
                        <Text className='font-light text-muted-foreground'>Frequency</Text>
                        <Text className='text-xl font-medium text-foreground'>{medicine?.frequency?.length}</Text>
                    </View>
                </View>
            </View>
            <ScrollView
                horizontal
                snapToOffsets={[0, 230, 450]}
                showsHorizontalScrollIndicator={false}
            >
                <TouchableOpacity className='p-3 border-[1px] rounded-2xl border-slate-200 mr-4 w-[230]'>
                    <Text className='text-xl text-foreground'>Progress</Text>
                    <Text className='text-muted-foreground'>Course started at {moment(medicine.startDate).format("DD MMM YYYY")}</Text>
                    <View className='m-auto my-3'>
                        <AnimatedCircularProgress
                            size={150}
                            width={8}
                            fill={Number(medicine.percentageCal) || 0}
                            tintColor="#3b82f6"
                            backgroundColor="gray">
                            {
                                () => (
                                    <>
                                        <Text className='text-3xl text-foreground'>
                                            {medicine.percentageCal || 0}%
                                        </Text>
                                        <Text className='text-muted-foreground'>complete</Text>
                                    </>
                                )
                            }
                        </AnimatedCircularProgress>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    router.push('/side-effect')
                }} className='p-4 rounded-2xl w-[220] bg-themeColor flex-col justify-between relative h-72'>
                    <Image source={require('~/assets/images/card_design.png')} className='absolute p-2 rounded bottom-10 -right-10 h-60 w-60' />
                    <View className='flex items-center justify-center w-12 h-12 bg-white rounded-md'>
                        <Text>AI</Text>
                    </View>
                    <View>
                        <Text className='text-xl font-bold text-white'>Possible Side effects</Text>
                        <Text className='text-white'>Learn more about this medication. Its side effects</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
            {
                medicine.special_instructions &&
                <View className='my-4'>
                    <Text className='text-2xl text-foreground'>Special Instructions</Text>
                    <Text className='text-xl font-light text-muted-foreground'>{medicine.special_instructions}</Text>
                </View>
            }
        </ScrollView>
    );
}

// Manufacture

export default MedicationSheet;
