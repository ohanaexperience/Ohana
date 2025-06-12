import React from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  ViewStyle,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
};

export default function KeyboardAwareScreen({
  children,
  style,
  contentContainerStyle,
}: Props) {
  return (
    <SafeAreaView style={[styles.safeArea, style, ]} edges={['bottom', 'left', 'right']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            contentContainerStyle,
            
          ]}
          enableOnAndroid
          extraScrollHeight={Platform.OS === 'ios' ? 100 : 140}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
          {Platform.OS === 'android' && <View style={styles.androidSpacer} />}
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 12 : 0, // extra space in header container if needed
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 100 : 0,
  },
  androidSpacer: {
    height: 70, // adjust as needed
  },
});