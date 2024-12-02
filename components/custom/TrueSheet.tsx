import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, Button, useColorScheme } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { NAV_THEME } from '~/lib/constants';

const TrueSheet = () => {
  const snapPoints = useMemo(() => ['50%', '100%'], []);
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const handleClose = () => bottomSheetRef.current?.close();
  const handleOpen = () => bottomSheetRef.current?.snapToIndex(0);
  const renderBackDrop = useCallback((props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []);
  // Theme setter
  const colorScheme = useColorScheme();
  const theme = NAV_THEME[colorScheme === "light" ? "light" : "dark"];

  // renders
  return (
    <View className='flex-1 bg-gray-400'>
      <Button onPress={handleClose} title='Close' />
      <Button onPress={handleOpen} title='Open' />

      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose={true}
        backdropComponent={renderBackDrop}
        handleIndicatorStyle={{ backgroundColor: theme.icon }}
        backgroundStyle={{ backgroundColor: theme.background}}
      >
        <BottomSheetView className='items-center flex-1 p-9'>
          <Text className='text-foreground'>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default TrueSheet;