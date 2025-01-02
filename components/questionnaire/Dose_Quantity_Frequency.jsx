import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, useColorScheme } from 'react-native';
import { Input } from '../ui/input';
import AntDesign from '@expo/vector-icons/AntDesign';
import { frequencyArray } from '~/util/splitSchedule'; // Import frequency options if needed globally
import { NAV_THEME } from '~/lib/constants';

const DoseQuantityFrequency = ({ medicineInfo, setMedicineInfo }) => {
    const colorScheme = useColorScheme();
    const themeColor = NAV_THEME[colorScheme === "light" ? "light" : "dark"];
    const [selectedFrequency, setSelectedFrequency] = useState(
        medicineInfo.frequency.length > 0
            ? medicineInfo.frequency
            : frequencyArray
    );

  

    const ref = useRef(null);
    const [timeIndex, setTimeIndex] = useState(null);

    const addTime = (item) => {
        setTimeIndex(item.index);
        scrollToIndex(item.index)
    }


    const renderFrequencyItem = (item) => {
        const active = item.index === timeIndex;
        const addedTime = item.item.number_of_tablets > 0 ? '#3b82f6' : themeColor.background;
        return <TouchableOpacity style={{ borderColor: addedTime, borderWidth: 2 }} onPress={() => { addTime(item) }} className={`flex items-center justify-center h-12 rounded-lg w-28 ${active ? 'bg-themeColor' : 'bg-primary-foreground'} me-3 `}>
            <Text className={`${active ? 'text-white' : 'text-foreground'} text-center`}>
                {item.item.time}
            </Text>
        </TouchableOpacity>
    };

    const scrollToIndex = index => {
        ref?.current?.scrollToIndex({
            animated: true,
            index: index,
            viewPosition: 0.5
        });
    }

    const changePillValue = (type) => {
        const new_freq = [...selectedFrequency];
        if (type === 'plus') {
            new_freq[timeIndex].number_of_tablets += 1;
            setSelectedFrequency(new_freq)
            setMedicineInfo({ ...medicineInfo, frequency: new_freq })
        }
        else if (type === 'minus') {
            if (new_freq[timeIndex].number_of_tablets > 0) {
                new_freq[timeIndex].number_of_tablets -= 1;
                setSelectedFrequency(new_freq)
            }
        }

    }
    return (
        <View className="flex-1 gap-y-4">
            <View>
                <Text style={{ marginBottom: 10 }} className="mb-5 text-2xl text-foreground">Dose (in mg)</Text>
                <Input
                    placeholder="Enter Dose"
                    value={medicineInfo.dose_in_mg}
                    onChangeText={(text) =>
                        setMedicineInfo({ ...medicineInfo, dose_in_mg: text })
                    }
                />
            </View>
            <View>
                <Text className="mb-5 text-2xl text-foreground" style={{ marginBottom: 15, marginTop: 15 }}>Quantity</Text>
                <Input
                    placeholder="Enter Quantity"
                    value={medicineInfo.quantity}
                    onChangeText={(text) =>
                        setMedicineInfo({ ...medicineInfo, quantity: text })
                    }
                />
            </View>
            <View>
                <Text className="my-5 text-2xl text-foreground">Schedule your meds</Text>
                <View>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={selectedFrequency}
                        keyExtractor={(item) => item.time}
                        renderItem={renderFrequencyItem}
                        ref={ref}
                    />
                </View>
                {
                    timeIndex != null && <View className='flex-row items-center m-auto mt-4'>
                        <TouchableOpacity className='p-3 rounded-lg bg-primary-foreground' onPress={
                            () => changePillValue('minus')}>
                            <AntDesign name="minus" size={20} color="#3b82f6" />
                        </TouchableOpacity>
                        <Text className='mx-4 text-3xl text-foreground'>{selectedFrequency[timeIndex]?.number_of_tablets}</Text>
                        <TouchableOpacity className='p-3 rounded-lg bg-primary-foreground' onPress={
                            () => changePillValue('plus')}>
                            <AntDesign name="plus" size={20} color="#3b82f6" />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </View>
    );
};

export default DoseQuantityFrequency;
