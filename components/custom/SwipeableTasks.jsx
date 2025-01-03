import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import SwipeableItem, {
  useSwipeableItemParams,
  OpenDirection,
} from 'react-native-swipeable-item';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
const OVERSWIPE_DIST = 20;
const NUM_ITEMS = 20;
import AntDesign from '@expo/vector-icons/AntDesign';
import iconRef from '~/util/MedicineIcon'

function SimpleSwipable({ tasks, handlePressItem }) {
  const [data, setData] = useState([]);
  const itemRefs = useRef(new Map());
  const colorScheme = useColorScheme();
  const themeText = NAV_THEME[colorScheme === "light" ? "light" : "dark"];

  useEffect(() => {
    setData(tasks);
    console.log('tasks', tasks.length)
  }, [tasks]);

  const renderItem = (params) => {
    const onPressDelete = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setData((prev) => {
        return prev.filter((item) => item !== params.item);
      });
    };

    return (
      <RowItem {...params} itemRefs={itemRefs} onPressDelete={onPressDelete} />
    );
  };

  function RowItem({ item, itemRefs, drag, onPressDelete }) {
    const swipeableRef = useRef(null);

    React.useEffect(() => {
      if (swipeableRef.current && !itemRefs.current.has(item.key)) {
        itemRefs.current.set(item.key, swipeableRef.current);
      }
      return () => {
        itemRefs.current.delete(item.key); // Clean up when component unmounts
      };
    }, [item.key, itemRefs]);

    return (
      <View style={styles.itemBreak}>
        <SwipeableItem
          key={item.key}
          item={item}
          ref={swipeableRef}
          onChange={({ openDirection }) => {
            if (openDirection !== OpenDirection.NONE) {
              [...itemRefs.current.entries()].forEach(([key, ref]) => {
                if (key !== item.key && ref) ref.close();
              });
            }
          }}
          overSwipe={OVERSWIPE_DIST}
          renderUnderlayLeft={() => (
            <UnderlayLeft drag={drag} onPressDelete={onPressDelete} />
          )}
          renderUnderlayRight={() => <UnderlayRight />}
          snapPointsLeft={[150]}
          snapPointsRight={[150]}>
          <TouchableOpacity
            activeOpacity={1}
            onLongPress={drag}
            style={{
              ...styles.sliders,
              backgroundColor: themeText.background,
              borderRadius: 15,
            }}
            onPress={() => handlePressItem(item)}>
            <View className="flex-row items-center justify-between w-full h-full px-5 bg-blue-50">
              <View className="flex-row items-center">
                <View
                  style={{ borderRadius: 15, marginRight: 8 }}
                  className="flex items-center justify-center p-4 bg-primary-foreground">
                  {
                    iconRef(item.form)
                  }
                </View>
                  <Text className="text-xl font-thin text-foreground"> 
                    {item.medicine} | {item.dose_in_mg} mg
                  </Text>
              </View>
              <Text className="flex items-center text-foreground">
                <AntDesign
                  name="clockcircleo"
                  size={18}
                  color={themeText.text}
                />{' '}{item.time}{' '}
              </Text>
            </View>
          </TouchableOpacity>
        </SwipeableItem>
      </View>
    );
  }

  const UnderlayLeft = ({
    drag,
    onPressDelete,
  }) => {
    const { item, percentOpen } = useSwipeableItemParams();
    const animStyle = useAnimatedStyle(
      () => ({
        opacity: percentOpen.value,
      }),
      [percentOpen]
    );

    return (
      <Animated.View
        style={[styles.row, styles.underlayLeft, animStyle]}
      >
        <TouchableOpacity onPress={onPressDelete} >
          <Feather name="trash-2" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  function UnderlayRight() {
    const { close } = useSwipeableItemParams();
    return (
      <Animated.View style={[styles.row, styles.underlayRight]}>
        <TouchableOpacity onPressOut={() => close()}>
          <AntDesign name="check" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <DraggableFlatList
        keyExtractor={(item) => item.id}
        data={data}
        renderItem={renderItem}
        onDragEnd={({ data }) => setData(data)}
        activationDistance={20}
      />
    </View>
  );
}

export default SimpleSwipable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 5,
  },
  row: {
    marginHorizontal: 10,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15

  },
  text: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 32,
  },
  underlayRight: {
    flex: 1,
    padding: 12,
    backgroundColor: 'teal',
    justifyContent: 'flex-start',
    paddingLeft: 70
  },
  underlayLeft: {
    flex: 1,
    padding: 12,
    backgroundColor: 'tomato',
    justifyContent: 'flex-end',
    paddingRight: 70
  },
  sliders: {
    marginHorizontal: 10,
    flex: 'row',
    alignItems: 'left',
    height: '100%',
    paddingVertical: 10,
  },
  itemBreak: {
    marginBottom: 5
  }
});
