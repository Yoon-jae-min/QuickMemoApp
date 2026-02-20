import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Memo } from '../../types';
import { formatRelativeDate } from '../../utils/formatDate';
import { COLORS } from '../../constants';

interface MemoListItemProps {
  item: Memo;
  onDelete: (id: string) => void;
}

const styles = StyleSheet.create({
  memoItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  memoContent: {
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 10,
    lineHeight: 22,
  },
  memoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memoDate: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.dangerBg,
  },
  deleteButtonText: {
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: '600',
  },
});

export function MemoListItem({ item, onDelete }: MemoListItemProps) {
  return (
    <View style={styles.memoItem}>
      <Text style={styles.memoContent} numberOfLines={3}>
        {item.content}
      </Text>
      <View style={styles.memoFooter}>
        <Text style={styles.memoDate}>{formatRelativeDate(item.createdAt)}</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
          <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
