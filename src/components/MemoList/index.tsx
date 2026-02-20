import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Modal, StyleSheet, Alert } from 'react-native';
import { Memo } from '../../types';
import { getMemos, deleteMemo } from '../../services/storage';
import { BottomSheet } from '../BottomSheet';
import { MemoListItem } from './MemoListItem';
import { styles } from './styles';

interface MemoListProps {
  visible: boolean;
  onClose: () => void;
}

export const MemoList: React.FC<MemoListProps> = ({ visible, onClose }) => {
  const [memos, setMemos] = useState<Memo[]>([]);

  const loadMemos = useCallback(async () => {
    const loadedMemos = await getMemos();
    setMemos(loadedMemos);
  }, []);

  useEffect(() => {
    if (visible) loadMemos();
  }, [visible, loadMemos]);

  const handleDelete = useCallback((id: string) => {
    Alert.alert(
      '삭제',
      '이 메모를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMemo(id);
              await loadMemos();
            } catch (error) {
              Alert.alert('오류', '메모 삭제에 실패했습니다.');
            }
          },
        },
      ]
    );
  }, [loadMemos]);

  const renderItem = useCallback(
    ({ item }: { item: Memo }) => <MemoListItem item={item} onDelete={handleDelete} />,
    [handleDelete]
  );

  return (
    <BottomSheet visible={visible} title="저장된 메모" onClose={onClose}>
      {memos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>메모가 없어요</Text>
          <Text style={styles.emptyText}>저장 버튼으로 메모를 저장해 보세요.</Text>
        </View>
      ) : (
        <FlatList
          data={memos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={12}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </BottomSheet>
  );
};
