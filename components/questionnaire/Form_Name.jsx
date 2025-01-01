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
        <Text className={`mt-6 text-md ${isActive ? 'text-white' : 'text-themeColor'}`}>{item.title}</Text>
    </TouchableOpacity>
);

const FormName = ({ medicineInfo, setMedicineInfo }) => {
    return (
            <View className='flex-1 mb-10 gap-y-4'>
                <View >
                    <Text style={{marginBottom: 10}} className="text-3xl text-foreground" >Medicine Name</Text>
                    <Input
                        placeholder='Medicine Name'
                        value={medicineInfo.medicine}
                        onChangeText={text => setMedicineInfo({ ...medicineInfo, medicine: text })}
                        aria-labelledby='inputLabel'
                        aria-errormessage='inputError'
                    />
                </View>
                <View className="mt-3">
                    <Text style={{ marginBottom: 15 }} className="text-3xl text-foreground">Choose Medicine Form</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', display: 'flex', height: '300', alignSelf: 'baseline', justifyContent: 'center', gap: 15 }} >
                        {
                            medicineForm.map((item, index) => (
                                <MedicineFormItem
                                    key={index}
                                    item={item}
                                    isActive={medicineInfo.form === item.title}
                                    onSelect={() => setMedicineInfo((prev) => ({ ...prev, form: item.title }))}
                                />
                            ))
                        }
                    </View>
                </View>


            </View>
    );
}

export default FormName;
