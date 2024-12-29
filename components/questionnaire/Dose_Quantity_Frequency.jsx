import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Input } from '../ui/input';
import { frequencyArray } from '~/util/splitSchedule'; // Import frequency options if needed globally

const DoseQuantityFrequency = ({ medicineInfo, setMedicineInfo }) => {
    const [selectedFrequency, setSelectedFrequency] = useState(
        medicineInfo.frequency.length > 0
            ? medicineInfo.frequency
            : frequencyArray
    );

    const updateFrequency = (time, value) => {
        const updatedFrequency = selectedFrequency.map((item) =>
            item.time === time ? { ...item, number_of_tablets: value } : item
        );
        setSelectedFrequency(updatedFrequency);
        setMedicineInfo((prev) => ({ ...prev, frequency: updatedFrequency }));
    };

    const renderFrequencyItem = ({ item }) => (
        <View className="flex-row items-center justify-between p-4 mb-2 rounded-lg bg-primary-foreground">
            <Text className="text-lg text-foreground">{item.time}</Text>
            <Input
                keyboardType="numeric"
                placeholder="0"
                value={item.number_of_tablets.toString()}
                onChangeText={(text) => updateFrequency(item.time, parseInt(text) || 0)}
                className="w-16 text-center"
            />
        </View>
    );

    return (
        <View className="flex-1 gap-y-4">
            <View>
                <Text className="mb-5 text-3xl text-foreground">Dose (in mg)</Text>
                <Input
                    placeholder="Enter Dose"
                    value={medicineInfo.dose_in_mg}
                    onChangeText={(text) =>
                        setMedicineInfo({ ...medicineInfo, dose_in_mg: text })
                    }
                />
            </View>
            <View>
                <Text className="mb-5 text-3xl text-foreground">Quantity</Text>
                <Input
                    placeholder="Enter Quantity"
                    value={medicineInfo.quantity}
                    onChangeText={(text) =>
                        setMedicineInfo({ ...medicineInfo, quantity: text })
                    }
                />
            </View>
            <View>
                <Text className="mb-5 text-3xl text-foreground">Frequency</Text>
                <FlatList
                    data={selectedFrequency}
                    keyExtractor={(item) => item.time}
                    renderItem={renderFrequencyItem}
                />
            </View>
        </View>
    );
};

export default DoseQuantityFrequency;
