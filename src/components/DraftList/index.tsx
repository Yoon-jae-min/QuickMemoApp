import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { BottomSheet } from '../BottomSheet';
import { COLORS } from '../../constants';
import { Draft, getDrafts, deleteDraft } from '../../services/storage';
import { formatRelativeDate } from '../../utils/formatDate';
import { styles } from './styles';

interface DraftListProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (draft: Draft) => void;
  onBackgroundPress: () => void;
}

export const DraftList: React.FC<DraftListProps> = ({
  visible,
  onClose,
  onSelect,
  onBackgroundPress,
}) => {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  const loadDrafts = useCallback(async () => {
    const loaded = await getDrafts();
    setDrafts(loaded);
  }, []);

  useEffect(() => {
    if (visible) {
      loadDrafts();
    }
  }, [visible, loadDrafts]);

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert(
        '삭제',
        '이 임시 저장을 삭제하시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '삭제',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteDraft(id);
                await loadDrafts();
              } catch (error) {
                Alert.alert('오류', '임시 저장 삭제에 실패했습니다.');
              }
            },
          },
        ],
      );
    },
    [loadDrafts],
  );

  const renderItem = useCallback(
    ({ item }: { item: Draft }) => (
      <View style={styles.itemContainer}>
        <Text
          style={styles.itemContent}
          numberOfLines={2}
          onPress={() => onSelect(item)}
        >
          {item.content}
        </Text>
        <View style={styles.itemFooter}>
          <Text style={styles.itemDate}>{formatRelativeDate(item.savedAt)}</Text>
          <Text style={styles.itemDelete} onPress={() => handleDelete(item.id)}>
            삭제
          </Text>
        </View>
      </View>
    ),
    [handleDelete, onSelect],
  );

  return (
    <BottomSheet
      visible={visible}
      title="임시 저장"
      onClose={onClose}
      onBackdropPress={onBackgroundPress}
      closeLabel="닫기"
    >
      {drafts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>임시 저장된 내용이 없습니다.</Text>
          <Text style={styles.emptyText}>메모를 입력한 뒤 바깥을 눌러 닫으면 임시 저장됩니다.</Text>
        </View>
      ) : (
        <FlatList
          data={drafts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </BottomSheet>
  );
}

