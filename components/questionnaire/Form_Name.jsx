import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Input } from '../ui/input';
import { medicineForm } from '~/util/splitSchedule';
import iconRef from '~/util/MedicineIcon';

const MedicineFormItem = ({ item, isActive, onSelect }) => (
    <TouchableOpacity
        onPress={onSelect}
        className={`flex-col items-center p-5 justify-evenly h-28 w-28 rounded-xl me-2 ${isActive ? 'bg-themeColor' : 'bg-primary-foreground'}`}
    >
        {iconRef(item.title, 30, isActive ? 'white' : '#3b82f6')}
        <Text className={`mt-6 text-md ${isActive ? 'text-white' : 'text-themeColor'}`}>{item.title}</Text>
    </TouchableOpacity>
);

const FormName = ({medicineInfo,setMedicineInfo}) => {
    return (
        <View className='flex-1 gap-y-4'>
            <View>
                <Text className="mb-5 text-3xl text-foreground">Choose Medicine Form</Text>
                <FlatList
                    horizontal
                    keyExtractor={(item) => item.title}
                    data={medicineForm}
                    className='pb-4'
                    renderItem={({ item }) => (
                        <MedicineFormItem
                            item={item}
                            isActive={medicineInfo.form === item.title}
                            onSelect={() => setMedicineInfo((prev) => ({ ...prev, form: item.title }))}
                        />
                    )}
                    extraData={medicineInfo.form}
                />
            </View>
            <View>
                <Text className="mb-5 text-3xl text-foreground">Medicine Name</Text>
                <Input
                    placeholder='Medicine Name'
                    value={medicineInfo.medicine}
                    onChangeText={text => setMedicineInfo({ ...medicineInfo, medicine: text })}
                    aria-labelledby='inputLabel'
                    aria-errormessage='inputError'
                />
            </View>

        </View>
    );
}

export default FormName;
