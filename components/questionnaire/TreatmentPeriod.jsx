import { Calendar } from 'react-native-calendars';
import { useEffect, useState } from 'react';
import { NAV_THEME } from '~/lib/constants';
import {useColorScheme, View, TouchableOpacity, ScrollView } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Text } from 'react-native';
import { Textarea } from '../ui/textarea';
import moment from 'moment';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [month, day, year] = dateString?.split('/').map(Number);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const TreatmentPeriodRefills = ({medicineInfo, setMedicineInfo}) => {

  const [startDate, setStartDate] = useState(formatDate(medicineInfo.treatment_start_date) || null);
  const [endDate, setEndDate] = useState(formatDate(medicineInfo.treatment_end_date) || null);
  
  const [markedDates, setMarkedDates] = useState(() => {
    // Initialize with default date range
    let range = {};
    let currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);

    while (currentDate <= endDateObj) {
      const dateString = currentDate.toISOString().split('T')[0];
      range[dateString] = {
        color: '#3b82f6',
        textColor: 'white',
        startingDay: dateString === startDate,
        endingDay: dateString === endDate,
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return range;
  });
  const colorScheme = useColorScheme();
  const themeColor = NAV_THEME[colorScheme === "light" ? "light" : "dark"];
  const [refills, setRefills] = useState(0);

  
  const handleDayPress = (day) => {
    if (!startDate || (startDate && endDate)) {
      // First click or reset
      setStartDate(day.dateString);
      setEndDate(null);
      setMarkedDates({
        [day.dateString]: {
          startingDay: true,
          color: '#3b82f6',
          textColor: 'white'
        }
      });
    } else {
      // Second click
      if (day.dateString < startDate) {
        // If selected end date is before start date, swap them
        setEndDate(startDate);
        setStartDate(day.dateString);
      } else {
        setEndDate(day.dateString);
      }
      console.log(startDate)
      let range = {};
      let currentDate = new Date(startDate);
      const endDateObj = new Date(day.dateString);

      while (currentDate <= endDateObj) {
        const dateString = currentDate.toISOString().split('T')[0];

        range[dateString] = {
          color: '#3b82f6',
          textColor: 'white',
          startingDay: dateString === startDate,
          endingDay: dateString === day.dateString
        };

        currentDate.setDate(currentDate.getDate() + 1);
      }

      setMarkedDates(range);
    }
  };

  useEffect(()=>{
    setMedicineInfo(prev=>({...prev, treatment_start_date: startDate, treatment_end_date: endDate}))
  }, [startDate, endDate])
  
  const changeRefillValue = (type) => {
    if (type === 'plus') {
      setMedicineInfo(prev => ({...prev, prescription_refills: prev.prescription_refills+1}));
    }
    else if (type === 'minus') {
      if (refills > 0) {
        setMedicineInfo(prev => ({...prev, prescription_refills: prev.prescription_refills-1}));
      }
    }

  }

  return (
    <>
      <Text className="text-2xl text-foreground">Select the length of your medication course:</Text>
      <Calendar
        markingType={'period'}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          backgroundColor: '#0a8cf7',
          calendarBackground: themeColor.background,
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#0a8cf7',
          todayTextColor: '#00adf5',
          dayTextColor: '#575757',
          textDisabledColor: '#dd99ee'
        }}
      />
      <Text className='text-2xl text-foreground' style={{ paddingVertical: 10 }}>
        Special Instructions (optional) 
      </Text>
      
      <Textarea 
        value={medicineInfo.special_instructions} 
        onChangeText={value=> setMedicineInfo(prev=>({...prev, special_instructions: value}))} multiline 
        numberOfLines={3} 
        placeholder='Eg. Take with warm water' />
        
      <Text className='text-2xl text-foreground' style={{ paddingVertical: 5 }}>Refills</Text>
      <View className='flex-row items-center m-auto mt-4 '>
        <TouchableOpacity className='p-3 rounded-lg bg-primary-foreground' onPress={
          () => changeRefillValue('minus')}>
          <AntDesign name="minus" size={20} color="#3b82f6" />
        </TouchableOpacity>
        <Text className='mx-4 text-3xl text-foreground'>{medicineInfo.prescription_refills}</Text>
        <TouchableOpacity className='p-3 rounded-lg bg-primary-foreground' onPress={
          () => changeRefillValue('plus')}>
          <AntDesign name="plus" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>
      </>
  );
};

export default TreatmentPeriodRefills;