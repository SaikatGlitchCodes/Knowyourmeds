import {Calendar} from 'react-native-calendars';
import {useState} from 'react';

const CalendarRange = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  const handleDayPress = (day:any) => {
    if (!startDate || (startDate && endDate)) {
      // First click or reset
      setStartDate(day.dateString);
      setEndDate(null);
      setMarkedDates({
        [day.dateString]: {
          startingDay: true,
          color: '#50cebb'
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

      let range: { [key: string]: { color: string; startingDay: boolean; endingDay: boolean } } = {};
      // Generate dates between start and end
      let currentDate = new Date(startDate);
      const endDateObj = new Date(day.dateString);

      while (currentDate <= endDateObj) {
        const dateString = currentDate.toISOString().split('T')[0];
        
        range[dateString] = {
          color: '#50cebb',
          startingDay: dateString === startDate,
          endingDay: dateString === day.dateString
        };
        
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setMarkedDates(range);
    }
  };

  return (
    <Calendar
      markingType={'period'}
      onDayPress={handleDayPress}
      markedDates={markedDates}
    />
  );
};

export default CalendarRange;