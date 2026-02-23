/**
 * QuickMemo - 빠르고 간편한 메모 앱
 * 팝업 형태로 메모를 빠르게 작성할 수 있습니다.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, TouchableOpacity, NativeModules, AppState, BackHandler } from 'react-native';
import { MemoPopup } from './src/components/MemoPopup';
import { MemoList } from './src/components/MemoList';
import { Settings } from './src/components/Settings';
import { saveDraft, clearDraft } from './src/services/storage';

const { AppExitModule } = NativeModules;

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const memoPopupRef = useRef<{ getContent: () => string }>(null);
  const [memoPopupVisible, setMemoPopupVisible] = useState(true);
  const [memoListVisible, setMemoListVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const handleShowList = useCallback(() => {
    setMemoPopupVisible(false);
    setMemoListVisible(true);
  }, []);

  const handleShowSettings = useCallback(() => {
    setMemoPopupVisible(false);
    setSettingsVisible(true);
  }, []);

  const handleCloseList = useCallback(() => {
    setMemoListVisible(false);
    setMemoPopupVisible(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setSettingsVisible(false);
    setMemoPopupVisible(true);
  }, []);

  const saveDraftAndExit = useCallback(async () => {
    const content = memoPopupRef.current?.getContent?.() ?? '';
    if (content.trim()) {
      await saveDraft(content);
    } else {
      await clearDraft();
    }
  }, []);

  useEffect(() => {
    const onAppStateChange = (nextState: string) => {
      if (nextState === 'background' || nextState === 'inactive') {
        saveDraftAndExit();
      }
    };
    const sub = AppState.addEventListener('change', onAppStateChange);
    return () => sub.remove();
  }, [saveDraftAndExit]);

  useEffect(() => {
    const onBack = () => {
      saveDraftAndExit();
      if (AppExitModule) AppExitModule.exitApp();
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => subscription.remove();
  }, [saveDraftAndExit]);

  const handleBackgroundPress = useCallback(async () => {
    await saveDraftAndExit();
    if (AppExitModule) {
      AppExitModule.exitApp();
    }
  }, [saveDraftAndExit]);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={handleBackgroundPress}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.centered}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={styles.popupTouchable}
        >
          <MemoPopup
            ref={memoPopupRef}
            visible={memoPopupVisible}
            onClose={(hasUnsavedContent) => {
              if (!hasUnsavedContent && AppExitModule) {
                AppExitModule.exitApp();
              }
            }}
            onShowList={handleShowList}
            onShowSettings={handleShowSettings}
          />
        </TouchableOpacity>
      </View>
      <MemoList
        visible={memoListVisible}
        onClose={handleCloseList}
      />
      <Settings
        visible={settingsVisible}
        onClose={handleCloseSettings}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupTouchable: {
    alignSelf: 'center',
  },
});

export default App;
