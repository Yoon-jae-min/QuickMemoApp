import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Memo } from '../../types';
import { saveMemo, clearAllMemos, getDraft, clearDraft } from '../../services/storage';
import { COLORS } from '../../constants';
import { styles } from './styles';

export interface MemoPopupProps {
  visible: boolean;
  /** 편집할 기존 메모. 없으면 새 메모 작성 모드 */
  editingMemo?: Memo | null;
  onClose: (hasUnsavedContent: boolean) => void;
  onShowList: () => void;
  onShowSettings: () => void;
}

export const MemoPopup = React.forwardRef<
  { getContent: () => string },
  MemoPopupProps
>(({ visible, editingMemo, onClose, onShowList, onShowSettings }, ref) => {
  const [content, setContent] = useState('');
  const [hasUnsavedContent, setHasUnsavedContent] = useState(false);

  React.useImperativeHandle(
    ref,
    () => ({
      getContent: () => content,
    }),
    [content],
  );

  useEffect(() => {
    if (!visible) {
      return;
    }

    // 편집 모드인 경우: 해당 메모 내용으로 채우고 임시저장은 무시
    if (editingMemo) {
      setContent(editingMemo.content);
      setHasUnsavedContent(false);
      return;
    }

    // 새 메모 모드: 임시 저장된 내용 불러오기
    getDraft().then((d) => {
      if (d?.content) {
        setContent(d.content);
        setHasUnsavedContent(true);
      } else {
        setContent('');
        setHasUnsavedContent(false);
      }
    });
  }, [visible, editingMemo]);

  const handleContentChange = useCallback((text: string) => {
    setContent(text);
    setHasUnsavedContent(text.trim().length > 0);
  }, []);

  const handleSave = useCallback(async () => {
    const trimmed = content.trim();
    if (trimmed.length === 0) {
      Alert.alert('알림', '내용을 입력해주세요.');
      return;
    }
    try {
      const now = Date.now();

      const base = editingMemo;
      const newMemo: Memo = base
        ? {
            ...base,
            content: trimmed,
            updatedAt: now,
          }
        : {
            id: now.toString(),
            content: trimmed,
            createdAt: now,
            updatedAt: now,
          };

      await saveMemo(newMemo);

      if (editingMemo) {
        // 편집 모드: 내용 유지, 임시저장 사용 안 함
        setContent(trimmed);
        setHasUnsavedContent(false);
        Alert.alert('저장 완료', '메모가 수정되었습니다.');
      } else {
        // 새 메모 모드: 입력창 비우고 임시저장 정리
        await clearDraft();
        setContent('');
        setHasUnsavedContent(false);
        Alert.alert('저장 완료', '메모가 저장되었습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '메모 저장에 실패했습니다.');
    }
  }, [content, editingMemo]);

  const handleClear = useCallback(() => {
    Alert.alert(
      '전체 삭제',
      '모든 메모를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllMemos();
              Alert.alert('완료', '모든 메모가 삭제되었습니다.');
            } catch (error) {
              Alert.alert('오류', '메모 삭제에 실패했습니다.');
            }
          },
        },
      ]
    );
  }, []);

  const handleBackdropPress = useCallback(() => {
    if (hasUnsavedContent) {
      Alert.alert(
        '저장하지 않은 내용',
        `저장하지 않은 내용이 있습니다:\n\n${content.substring(0, 100)}${content.length > 100 ? '...' : ''}\n\n정말 닫으시겠습니까?`,
        [
          { text: '취소', style: 'cancel' },
          {
            text: '닫기',
            style: 'destructive',
            onPress: () => {
              setContent('');
              setHasUnsavedContent(false);
              onClose(false);
            },
          },
        ]
      );
    } else {
      onClose(false);
    }
  }, [hasUnsavedContent, content, onClose]);

  if (!visible) return null;

  return (
    <View style={styles.popupOnly}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.popupContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleSave}>
              <Text style={[styles.buttonText, styles.primaryButtonText]}>저장</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onShowList}>
              <Text style={styles.buttonText}>목록</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleClear}>
              <Text style={[styles.buttonText, styles.dangerText]}>전체 삭제</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onShowSettings}>
              <Text style={styles.buttonText}>설정</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="메모를 입력하세요..."
            placeholderTextColor={COLORS.textPlaceholder}
            value={content}
            onChangeText={handleContentChange}
            textAlignVertical="top"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
});
