import React from 'react';
import { View, Text, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from '../ui/input';
import { medicineForm } from '~/util/splitSchedule';
import iconRef from '~/util/MedicineIcon';

const MedicineFormItem = ({ item, isActive, onSelect }) => (
    <TouchableOpacity
        onPress={onSelect}
        style={{ marginEnd: 3 }}
        className={`flex-col items-center p-5 justify-between h-28 w-28 rounded-xl ${isActive ? 'bg-themeColor' : 'bg-primary-foreground'}`}
    >
        {iconRef(item.title, 30, isActive ? 'white' : '#3b82f6')}
        <Text className={`mt-6 text-md ${isActive ? 'text-white' : 'text-[#3b82f6]'}`}>{item.title}</Text>
    </TouchableOpacity>
);

const FormName = ({ values, errors, touched, handleChange, setFieldValue }) => {
    return (
            <View className='flex-1 mb-10 gap-y-4'>
                <View >
                    <Text className="text-2xl text-foreground" >Medicine Name</Text>
                    <Input
                        placeholder='Medicine Name'
                        value={values.medicine}
                        onChangeText={handleChange('medicine')}
                        error={touched.medicine && errors.medicine}
                    />
                    {touched.medicine && errors.medicine && (
                        <Text className="mt-2 text-red-500">{errors.medicine}</Text>
                    )}
                </View>
                <View className="mt-3">
                    <Text className="text-2xl text-foreground">Choose Medicine Form</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', display: 'flex', alignSelf: 'baseline', justifyContent: 'center', gap: 15 }} >
                        {
                            medicineForm.map((item, index) => (
                                <MedicineFormItem
                                    key={index}
                                    item={item}
                                    isActive={values.form === item.title}
                                    onSelect={() => setFieldValue('form', item.title)}
                                />
                            ))
                        }
                    </View>
                    {touched.form && errors.form && (
                        <Text className="mt-2 text-red-500">{errors.form}</Text>
                    )}
                </View>
            </View>
    );
}

export default FormName;
