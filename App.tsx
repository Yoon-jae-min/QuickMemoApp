/**
 * QuickMemo - 빠르고 간편한 메모 앱
 * 팝업 형태로 메모를 빠르게 작성할 수 있습니다.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  TouchableOpacity,
  NativeModules,
  AppState,
  BackHandler,
  Alert,
} from 'react-native';
import { MemoPopup } from './src/components/MemoPopup';
import { MemoList } from './src/components/MemoList';
import { DraftList } from './src/components/DraftList';
import { Settings } from './src/components/Settings';
import { saveDraft, clearDraft, Draft } from './src/services/storage';
import { Memo } from './src/types';

const { AppExitModule } = NativeModules;

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const memoPopupRef = useRef<{ getContent: () => string }>(null);
  const [memoPopupVisible, setMemoPopupVisible] = useState(true);
  const [memoListVisible, setMemoListVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [draftListVisible, setDraftListVisible] = useState(false);
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);

  const handleShowList = useCallback(() => {
    setEditingMemo(null);
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

  const handleEditMemo = useCallback((memo: Memo) => {
    setEditingMemo(memo);
    setMemoListVisible(false);
    setMemoPopupVisible(true);
  }, []);

  const handleShowDrafts = useCallback(() => {
    setDraftListVisible(true);
  }, []);

  const handleCloseDrafts = useCallback(() => {
    setDraftListVisible(false);
  }, []);

  const handleSelectDraft = useCallback(
    (draft: Draft) => {
      setEditingMemo(null);
      setDraftListVisible(false);
      setMemoPopupVisible(true);
      memoPopupRef.current?.setContent?.(draft.content);
    },
    [],
  );

  const saveDraftAndExit = useCallback(async () => {
    const content = memoPopupRef.current?.getContent?.() ?? '';
    if (content.trim()) {
      await saveDraft(content);
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
      const currentContent = memoPopupRef.current?.getContent?.() ?? '';
      const trimmed = currentContent.trim();

      if (!trimmed) {
        if (AppExitModule) AppExitModule.exitApp();
        return true;
      }

      const preview = trimmed.substring(0, 100) + (trimmed.length > 100 ? '...' : '');

      Alert.alert('임시 저장', `현재 내용을 임시 저장하시겠습니까?\n\n${preview}`, [
        {
          text: '아니요',
          style: 'destructive',
          onPress: () => {
            memoPopupRef.current?.setContent?.('');
            if (AppExitModule) AppExitModule.exitApp();
          },
        },
        {
          text: '예',
          onPress: async () => {
            await saveDraft(trimmed);
            memoPopupRef.current?.setContent?.('');
            if (AppExitModule) AppExitModule.exitApp();
          },
        },
      ]);

      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => subscription.remove();
  }, []);

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
            editingMemo={editingMemo}
            onClose={(hasUnsavedContent) => {
              setEditingMemo(null);
              if (!hasUnsavedContent && AppExitModule) {
                AppExitModule.exitApp();
              }
            }}
            onShowList={handleShowList}
            onShowDrafts={handleShowDrafts}
            onShowSettings={handleShowSettings}
          />
        </TouchableOpacity>
      </View>
      <MemoList
        visible={memoListVisible}
        onClose={handleCloseList}
        onSelect={handleEditMemo}
        onBackgroundPress={handleBackgroundPress}
      />
      <DraftList
        visible={draftListVisible}
        onClose={handleCloseDrafts}
        onSelect={handleSelectDraft}
        onBackgroundPress={handleBackgroundPress}
      />
      <Settings
        visible={settingsVisible}
        onClose={handleCloseSettings}
        onBackgroundPress={handleBackgroundPress}
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
