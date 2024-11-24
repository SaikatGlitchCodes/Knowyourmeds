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
import DraggableFlatList, {

} from 'react-native-draggable-flatlist';
import { NAV_THEME } from '~/lib/constants';
import { colorScheme } from 'nativewind';
import Feather from '@expo/vector-icons/Feather';
const OVERSWIPE_DIST = 20;
const NUM_ITEMS = 20;


function SimpleSwipable(props) {
const themecontrol = NAV_THEME[colorScheme === "light" ? "light" : "dark"]
  const [data, setData] = useState(props.tasks);
  const itemRefs = useRef(new Map());

  const renderItem = useCallback((params) => {
    const onPressDelete = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setData((prev) => {
        return prev.filter((item) => item !== params.item);
      });
    };

    return (
      <RowItem {...params} itemRefs={itemRefs} onPressDelete={onPressDelete} />
    );
  }, []);

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

function RowItem({ item, itemRefs, drag, onPressDelete }) {
const themecontrol = NAV_THEME[colorScheme === "light" ? "light" : "dark"]
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
          style={styles.sliders}
          className='border-2 rounded-full'>

          <View className='flex-row items-center h-full px-5'>
            <Image source={{ uri: item.image }} style={{ height: 20, width: 20, marginRight: 20 }} />
            <View>
              <Text className='text-2xl text-foreground'> {item.name} </Text>
            </View>
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
      style={[styles.row, styles.underlayLeft, animStyle]} // Fade in on open
    >
      <TouchableOpacity onPress={onPressDelete} >
        <Feather name="trash-2" size={24} color={themecontrol.text} />
      </TouchableOpacity>
    </Animated.View>
  );
};

function UnderlayRight() {
  const { close } = useSwipeableItemParams();
  return (
    <Animated.View style={[styles.row, styles.underlayRight]}>
      <TouchableOpacity onPressOut={() => close()}>
        <Text style={styles.text}>CLOSE</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  row: {

    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
   
    
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 32,
  },
  underlayRight: {
    flex: 1,
    backgroundColor: 'teal',
    justifyContent: 'flex-start',
  },
  underlayLeft: {
    flex: 1,
    padding: 12,
    backgroundColor: 'tomato',
    justifyContent: 'flex-end',
    borderRadius: 30,
    
  },
  sliders: {
    marginHorizontal: 7,
    height: 60,
    flex: 'row',
    alignItems: 'left',

    backgroundColor: themecontrol.border,
    borderColor: themecontrol.border
  },
  itemBreak:{
    marginBottom:10
  }

});
