import React, {
  useCallback,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
  ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { NAV_THEME } from '~/lib/constants';

interface TrueSheetProps {
  handleSheetChanges?:any,
  snapPoint?:any,
  children: ReactNode; // Children components to render inside the sheet
}

const TrueSheet = forwardRef(({ children, snapPoint, handleSheetChanges }: TrueSheetProps, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Snap points for BottomSheet
  const snapPoints = useMemo(() => snapPoint || ['50%', '100%'], []);

  // Handle methods exposed to parent
  useImperativeHandle(ref, () => ({
    snapToIndex: (index: number) => bottomSheetRef.current?.snapToIndex(index),
    close: () => bottomSheetRef.current?.close(),
  }));

  // Callbacks


  const renderBackDrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
    ),
    []
  );

  // Theme handling
  const colorScheme = useColorScheme();
  const theme = NAV_THEME[colorScheme === 'light' ? 'light' : 'dark'];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={-1}
      enablePanDownToClose={true}
      backdropComponent={renderBackDrop}
      onChange={handleSheetChanges}
      handleIndicatorStyle={{ backgroundColor: theme.icon }}
      backgroundStyle={{ backgroundColor: theme.border }}
    >
      <BottomSheetView className="items-center flex-1 p-9">{children}</BottomSheetView>
    </BottomSheet>
  );
});

export default TrueSheet;
