import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Input } from '../ui/input';
import AntDesign from '@expo/vector-icons/AntDesign';
import { frequencyArray } from '~/util/splitSchedule'; // Import frequency options if needed globally


const DoseQuantityFrequency = ({ medicineInfo, setMedicineInfo }) => {
    const [selectedFrequency, setSelectedFrequency] = useState(
        medicineInfo.frequency.length > 0
            ? medicineInfo.frequency
            : frequencyArray
    );

    const ref = useRef(null);
    const [time, setTime] = useState('');
    const [noOfMeds, setnoOfMeds] = useState(0);

    const updateFrequency = (time, value) => {
        const updatedFrequency = selectedFrequency.map((item) =>
            item.time === time ? { ...item, number_of_tablets: value } : item
        );
        setSelectedFrequency(updatedFrequency);
        setMedicineInfo((prev) => ({ ...prev, frequency: updatedFrequency }));
    };
    const addTime = (item) => {
        setTime(item.item.time);
        scrollToIndex(item.index)
    }

    

    const renderFrequencyItem = (item) => {
        const active = item.item.time === time;
        return <TouchableOpacity onPress={() => { addTime(item) }} className={`flex items-center justify-center h-12 rounded-lg w-28 ${active ? 'bg-themeColor' : 'bg-primary-foreground'} me-3`}>
            <Text className={`${active ? 'text-white' : 'text-black'} text-center`}>
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
        if (type === 'plus') {
            setnoOfMeds(noOfMeds + 1);
            updateFrequency(time, noOfMeds + 1);
        }
        else if (type === 'minus') {
            if (noOfMeds > 0) {
                setnoOfMeds(noOfMeds - 1)
                updateFrequency(time, noOfMeds - 1);
            }
        }

    }
    return (
        <View className="flex-1 gap-y-4">
            <View>
                <Text style={{ marginBottom: 10 }} className="mb-5 text-3xl text-foreground">Dose (in mg)</Text>
                <Input
                    placeholder="Enter Dose"
                    value={medicineInfo.dose_in_mg}
                    onChangeText={(text) =>
                        setMedicineInfo({ ...medicineInfo, dose_in_mg: text })
                    }
                />
            </View>
            <View>
                <Text className="mb-5 text-3xl text-foreground" style={{ marginBottom: 15, marginTop: 15 }}>Quantity</Text>
                <Input
                    placeholder="Enter Quantity"
                    value={medicineInfo.quantity}
                    onChangeText={(text) =>
                        setMedicineInfo({ ...medicineInfo, quantity: text })
                    }
                />
            </View>
            <View>
                <Text className="mb-5 text-3xl text-foreground">Schedule your meds</Text>
                <View className='ms-4'>
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
                    time && <View className='flex-row items-center m-auto mt-4'>
                        <TouchableOpacity className='p-3 rounded-lg bg-primary-foreground' onPress={
                            () => changePillValue('minus')}>
                            <AntDesign name="minus" size={20} color="#3b82f6" />
                        </TouchableOpacity>
                        <Text className='mx-4 text-3xl'>{noOfMeds}</Text>
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
