import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

const App = () => {
    const snapPoints = useMemo(()=>['50%','100%'],[]);
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const handleClose = () => bottomSheetRef.current?.close();
  const handleOpen = () => bottomSheetRef.current?.snapToIndex(1);
  const renderBackDrop =useCallback((props:any)=><BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,[]);
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
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheet>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});

export default App;