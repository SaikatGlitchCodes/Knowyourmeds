import BottomSheet from '@gorhom/bottom-sheet';
import React, { useRef, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import TrueSheet from '~/components/custom/TrueSheet';

const Tryout = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>('Welcome');
  const sheetRef = useRef<BottomSheet>(null);
  console.log('sheetRef:', sheetRef.current);
  const openSheetWithItem = (item: string) => {
    setSelectedItem(item); // Set the selected item
    sheetRef.current?.snapToIndex(1); // Open the sheet
  };

  return (
    <View className="items-center justify-center flex-1">
      <Button title="Open Sheet with Item 1" onPress={() => openSheetWithItem('Item 1')} />
      <Button title="Open Sheet with Item 2" onPress={() => openSheetWithItem('Item 2')} />
      <TrueSheet ref={sheetRef} item={selectedItem || 'No item selected'} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default Tryout;
