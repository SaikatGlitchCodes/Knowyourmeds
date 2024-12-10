import React, { useCallback, useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import {Text, useColorScheme } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { NAV_THEME } from '~/lib/constants';

const TrueSheet = forwardRef(({ item }: { item: string }, ref) => {
  const snapPoints = useMemo(() => ['50%', '100%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const handleClose = () => bottomSheetRef.current?.close();
  const renderBackDrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
    []
  );

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    snapToIndex: (index: number) => bottomSheetRef.current?.snapToIndex(index),
    close: handleClose,
  }));

  // Theme setter
  const colorScheme = useColorScheme();
  const theme = NAV_THEME[colorScheme === 'light' ? 'light' : 'dark'];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      snapPoints={snapPoints}
      index={-1}
      enablePanDownToClose={true}
      backdropComponent={renderBackDrop}
      handleIndicatorStyle={{ backgroundColor: theme.icon }}
      backgroundStyle={{ backgroundColor: theme.background }}
    >
      <BottomSheetView className="items-center flex-1 p-9">
        <Text className="text-foreground">Selected Item: {item}</Text>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default TrueSheet;
