import { Calendar } from 'react-native-calendars';
import { useState } from 'react';
import { NAV_THEME } from '~/lib/constants';
import { KeyboardAvoidingView, KeyboardAvoidingViewComponent, useColorScheme, View, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Text } from 'react-native';
import { Textarea } from '../ui/textarea';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { Input } from '~/components/ui/input';


const TreatmentPeriodRefills = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const colorScheme = useColorScheme();
  const themeColor = NAV_THEME[colorScheme === "light" ? "light" : "dark"].text;
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

  const changeRefillValue = (type) => {
    if (type === 'plus') {
      setRefills(refills + 1);
    }
    else if (type === 'minus') {
      if (refills > 0) {
        setRefills(refills - 1);
      }
    }

  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 40 : 0 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>

        <Text className="text-3xl">Select the length of your medication course:</Text>
        <Calendar
          markingType={'period'}
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={{
            backgroundColor: '#0a8cf7',
            calendarBackground: themeColor.backgroundColor,
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#0a8cf7',
            todayTextColor: '#00adf5',
            dayTextColor: '#575757',
            textDisabledColor: '#dd99ee'
          }}
        />
        <Text className='text-3xl' style={{ paddingVertical: 10 }}>Special Instructions (optional) </Text>
        <Textarea placeholder='Eg. Take with warm water' />
        <Text className='text-3xl' style={{ paddingVertical: 5 }}>Refills</Text>
        <View className='flex-row items-center m-auto mt-4 '>
          <TouchableOpacity className='p-3 rounded-lg bg-primary-foreground' onPress={
            () => changeRefillValue('minus')}>
            <AntDesign name="minus" size={20} color="#3b82f6" />
          </TouchableOpacity>
          <Text className='mx-4 text-3xl'>{refills}</Text>
          <TouchableOpacity className='p-3 rounded-lg bg-primary-foreground' onPress={
            () => changeRefillValue('plus')}>
            <AntDesign name="plus" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>

  );
};

export default TreatmentPeriodRefills;