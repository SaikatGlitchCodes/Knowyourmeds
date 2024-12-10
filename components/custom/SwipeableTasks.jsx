import React, { useState, useRef, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  LayoutAnimation,
  TouchableOpacity,
  Image,
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

function SimpleSwipable(props, ref) {
  const [data, setData] = useState(props.tasks);
  const itemRefs = useRef(new Map());
  const colorScheme = useColorScheme();

  const themeText = NAV_THEME[colorScheme === "light" ? "light" : "dark"];
  
  const handlePressItem = (item) => {
    
    console.log('Pressed item: ' + item.name);
  };
  
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
    return (
      <View style={styles.itemBreak}>
        <SwipeableItem
          key={item.key}
          item={item}
          ref={(ref) => {
            if (ref && !itemRefs.current.get(item.key)) {
              itemRefs.current.set(item.key, ref);
            }
          }}
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
            style={{ ...styles.sliders, backgroundColor: themeText.background, borderRadius: 15  }}
            onPress={()=>handlePressItem(item)}>

            <View className='flex-row items-center justify-between w-full h-full px-5'>
              <View className='flex-row items-center'>
                <View style={{borderRadius: 15, marginRight:8}} className='flex items-center justify-center p-4 bg-primary-foreground'><Image source={{ uri: item.image }} style={{ height: 20, width: 20}} /></View>
                <View>
                  <Text className='text-xl text-foreground'> {item.name} </Text>
                  <Text className='text-foreground'> {item.description} </Text>
                </View>
              </View>
              <Text className='text-foreground'> <AntDesign name="clockcircleo" size={14} color={themeText.text} />  {item.time} </Text>
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
      <Text style={{paddingLeft:10}} className='mb-4 text-2xl font-semibold text-foreground'>To Take</Text>
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
    marginBottom: 40,
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
    marginBottom: 10
  }
});
