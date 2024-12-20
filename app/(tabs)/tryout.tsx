import BottomSheet from '@gorhom/bottom-sheet';
import React, { useRef, useState } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import TrueSheet from '~/components/custom/TrueSheet';

const Tryout = () => {
  const sheetRef = useRef<BottomSheet>(null);

  const openSheetWithItem = (item: string) => {
    sheetRef.current?.snapToIndex(0); // Open the sheet
  };

  return (
    <View className="items-center justify-center flex-1">
      <Button title="Open Sheet with Item 1" onPress={() => openSheetWithItem('Item 1')} />
      <TrueSheet ref={sheetRef} >
        <Text>Hello </Text>
      </TrueSheet>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Tryout;
