import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import moment from 'moment';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import calculateProgressPercentage from '~/util/calculateProgress';
import { ScrollView } from 'react-native-gesture-handler';
import iconRef from '~/util/MedicineIcon';
interface MedicationSheetProps {
    medicine: {
        id: number,
        name: string,
        description: string,
        time: string,
        image: string,
    }
}

const MedicationSheet = ({ medicine }: any) => {
    console.log(medicine.progressPercentage)
    return (
        <View className='w-full gap-y-5'>
            <View>
                <Text className='mb-2 text-3xl font-semibold'>{medicine.name} {medicine.dose}</Text>
                <Text className='text-xl text-md'>{medicine.description}</Text>
            </View>
            <View >
                <Text className='text-2xl'>Schedule</Text>
                <View className='flex-row items-center mt-2 gap-x-4'>
                    <View className='flex items-center justify-center rounded-lg h-11 w-11 bg-[#3b82f6]'>
                        <AntDesign name="plus" size={30} color="white" />
                    </View>
                    {
                        medicine.schedule?.map((time: any, index: number) => {
                            return (
                                <View key={index} className='flex items-center px-5 py-2 rounded-lg h-11 bg-primary-foreground'>
                                    <Text className='text-xl font-light '>{time}</Text>
                                </View>
                            )
                        })
                    }
                </View>

            </View>
            <View className='p-5 rounded-xl bg-primary-foreground'>
                <View className='flex-row items-center gap-x-4'>
                    {iconRef(medicine)}
                    <Text className='text-2xl'>{medicine.type}</Text>
                </View>
                <View className='flex-row justify-between mt-4 gap-x-4'>
                    <View>
                        <Text className='font-light'>Duration</Text>
                        <Text className='text-xl font-medium'>{medicine.duration}</Text>
                    </View>
                    <View>
                        <Text className='font-light'>Dose</Text>
                        <Text className='text-xl font-medium'>{medicine.dose}</Text>
                    </View>
                    <View>
                        <Text className='font-light'>Frequency</Text>
                        <Text className='text-xl font-medium'>{medicine.frequency}</Text>
                    </View>
                </View>
            </View>
            <ScrollView
                // contentContainerStyle={{ paddingHorizontal:  }}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ marginTop: 10}}
            >
                <View className='p-3 border-[1px] rounded-2xl border-slate-200 mr-4 w-[230]'>
                    <Text className='text-xl'>Progress</Text>
                    <Text>Course started at {moment(medicine.startDate).format("DD MMM YYYY")}</Text>
                    <View className='m-auto my-3'>
                        <AnimatedCircularProgress
                            size={150}
                            width={8}
                            fill={medicine.progressPercentage || 0}
                            tintColor="#3b82f6"
                            backgroundColor="black">
                            {
                                () => (
                                    <>
                                        <Text className='text-3xl'>
                                            {medicine.progressPercentage}%
                                        </Text>
                                        <Text>complete</Text>
                                    </>
                                )
                            }
                        </AnimatedCircularProgress>
                    </View>
                </View>
                <View className='p-4 rounded-2xl w-[220] bg-[#3b82f6] flex-col justify-between relative'>
                    <Image source={require('~/assets/images/card_design.png')} className='absolute p-2 rounded bottom-10 -right-10 h-60 w-60' />
                    <View className='flex items-center justify-center w-12 h-12 bg-white rounded-md'>
                        <Text>AI</Text>
                    </View>
                    <View>
                        <Text className='text-xl font-bold text-white'>Possible Side effects</Text>
                        <Text className='text-white'>Learn more about this medication. Its side effects</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({})

export default MedicationSheet;
