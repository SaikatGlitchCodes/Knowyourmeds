import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ListRenderItem,
    NativeSyntheticEvent, NativeScrollEvent,
    useColorScheme,
    Image,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { NAV_THEME } from '~/lib/constants';

interface DateItem {
    date: string;
    day: string;
    isToday: boolean;
    id: string;
}

interface HorizontalCalendarProps {
    selectedDate: string;
    setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
}

const ITEM_WIDTH = 60;
const ITEMS_PER_PAGE = 5;
const THRESHOLD = 5;

function generateDatesAround(centerDate: Date, daysBack: number, daysForward: number): { dates: DateItem[]; todayIndex: number } {
    const result: DateItem[] = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().toISOString().split('T')[0];
    const date = new Date(centerDate);
    let todayIndex = -1;

    for (let i = daysBack; i > 0; i--) {
        const prevDate = new Date(date);
        prevDate.setDate(date.getDate() - i);
        const dateStr = prevDate.toISOString().split('T')[0];
        result.push({
            date: dateStr,
            day: days[prevDate.getDay()],
            isToday: dateStr === today,
            id: dateStr,
        });
    }

    const centerDateStr = date.toISOString().split('T')[0];
    result.push({
        date: centerDateStr,
        day: days[date.getDay()],
        isToday: centerDateStr === today,
        id: centerDateStr,
    });

    if (centerDateStr === today) {
        todayIndex = result.length - 1;
    }

    for (let i = 1; i <= daysForward; i++) {
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + i);
        const dateStr = nextDate.toISOString().split('T')[0];
        result.push({
            date: dateStr,
            day: days[nextDate.getDay()],
            isToday: dateStr === today,
            id: dateStr,
        });

        if (dateStr === today) {
            todayIndex = result.length - 1;
        }
    }

    return { dates: result, todayIndex };
}

const HorizontalCalendar: React.FC<HorizontalCalendarProps> = ({ selectedDate, setSelectedDate }) => {
    const { dates: initialDates, todayIndex } = generateDatesAround(new Date(), ITEMS_PER_PAGE, ITEMS_PER_PAGE);

    const [dates, setDates] = useState<DateItem[]>(initialDates);
    const [currentMonth, setCurrentMonth] = useState<string>(
        new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    );

    const flatListRef = useRef<FlatList>(null);
    const lastTriggeredIndex = useRef<number | null>(null);
    const scrollOffset = useRef<number>(0);
    const colorScheme = useColorScheme();
    const textColor = NAV_THEME[colorScheme === "light" ? "light" : "dark"].text;

    const handleScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            scrollOffset.current = offsetX;

            const index = Math.round(offsetX / ITEM_WIDTH);

            if (index >= 0 && index < dates.length) {
                const currentDate = dates[index];
                const currentMonthString = new Date(currentDate.date).toLocaleString('default', {
                    month: 'long',
                    year: 'numeric',
                });

                if (currentMonthString !== currentMonth) {
                    setCurrentMonth(currentMonthString);
                }

                // Trigger haptics only if a new index is reached
                if (index !== lastTriggeredIndex.current) {
                    lastTriggeredIndex.current = index;
                    Haptics.selectionAsync(); // Provide feedback as the user scrolls
                }
            }
        },
        [dates, currentMonth]
    );

    const handleResetToToday = () => {
        const todayIndex = dates.findIndex((item) => item.isToday);
        if (todayIndex !== -1) {
            flatListRef.current?.scrollToIndex({
                index: todayIndex,
                animated: true,
            });
            Haptics.selectionAsync(); // Feedback on reset
        }
        setSelectedDate(dates[todayIndex].date);
    };

    const loadMoreDates = useCallback(
        (direction: 'back' | 'forward') => {
            const centerDate = new Date(
                direction === 'back' ? dates[0].date : dates[dates.length - 1].date
            );

            const additionalDates = generateDatesAround(
                centerDate,
                direction === 'back' ? ITEMS_PER_PAGE : 0,
                direction === 'forward' ? ITEMS_PER_PAGE : 0
            ).dates;

            setDates((prevDates) => {
                if (direction === 'back') {
                    const filteredDates = additionalDates.filter(
                        (date) => !prevDates.some((d) => d.date === date.date)
                    );
                    return [...filteredDates, ...prevDates];
                } else {
                    const filteredDates = additionalDates.filter(
                        (date) => !prevDates.some((d) => d.date === date.date)
                    );
                    return [...prevDates, ...filteredDates];
                }
            });

            if (direction === 'back') {
                flatListRef.current?.scrollToOffset({
                    offset: scrollOffset.current + ITEMS_PER_PAGE * ITEM_WIDTH,
                    animated: false,
                });
            }
        },
        [dates]
    );

    const renderDateItem: ListRenderItem<DateItem> = useCallback(
        ({ item }) => {
            const isSelected = item.date === selectedDate;

            const handlePress = () => {
                Haptics.selectionAsync(); // Feedback on date selection
                setSelectedDate(item.date);
            };

            return (
                <TouchableOpacity
                    style={[
                        styles.dateItem,
                        item.isToday && styles.todayItem,
                        isSelected && styles.selectedItem,
                    ]}
                    className={`items-center py-8 mx-2 ${textColor} border-[1.5px] rounded-full border-gray-500 px-4`}
                    onPress={handlePress}
                >
                    <Text style={[styles.dayText, item.isToday && styles.todayText]}>{item.day}</Text>
                    <Text className={`text-2xl ${item.isToday && 'text-white'} text-foreground`}>{item.date.split('-')[2]}</Text>
                    <Image source={{uri: '../assets/images/icon.png'}} className='w-4 h-4' />
                </TouchableOpacity>
            );
        },
        [selectedDate]
    );

    return (
        <View className="mx-2 my-8">
            <View className="flex-row justify-between mb-3">
                <Text className="text-2xl text-foreground">{currentMonth}</Text>
                <MaterialCommunityIcons onPress={handleResetToToday} name="backup-restore" size={24} color={textColor} />
            </View>

            <FlatList
                ref={flatListRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={dates}
                renderItem={renderDateItem}
                keyExtractor={(item) => item.id}
                initialScrollIndex={todayIndex}
                snapToInterval={ITEM_WIDTH}
                decelerationRate="fast"
                onScroll={handleScroll}
                scrollEventThrottle={16}
                onEndReachedThreshold={0.5}
                onEndReached={() => loadMoreDates('forward')}
                onMomentumScrollBegin={() => {
                    if (scrollOffset.current <= ITEM_WIDTH * THRESHOLD) {
                        loadMoreDates('back');
                    }
                }}
                getItemLayout={(_, index) => ({
                    length: ITEM_WIDTH,
                    offset: ITEM_WIDTH * index,
                    index,
                })}
            />
        </View>
    );
};

const styles = {
    dateItem: {
        width: ITEM_WIDTH,
    },
    todayItem: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    selectedItem: {
        borderColor: '#3b82f6',
    },
    dayText: {
        fontSize: 12,
        color: '#6b7280',
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    todayText: {
        color: '#ffffff',
    },
};

export default HorizontalCalendar;
