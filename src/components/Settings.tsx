import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BottomSheet } from './BottomSheet';
import { COLORS } from '../constants';

interface SettingsProps {
  visible: boolean;
  onClose: () => void;
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  sectionCard: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  sectionTextMuted: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 20,
  },
});

export const Settings: React.FC<SettingsProps> = ({ visible, onClose }) => (
  <BottomSheet visible={visible} title="설정" onClose={onClose}>
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>앱 정보</Text>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionText}>QuickMemo v1.0.0</Text>
          <Text style={styles.sectionTextMuted}>빠르고 간편한 메모 앱입니다.</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>사용 방법</Text>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionText}>
            • 앱을 열면 팝업 형태의 메모장이 나타납니다.{'\n'}
            • 메모를 입력하고 저장 버튼을 누르면 저장됩니다.{'\n'}
            • 목록 버튼으로 저장된 메모를 확인할 수 있습니다.{'\n'}
            • 바깥을 눌러 닫으면 자동으로 임시 저장됩니다.
          </Text>
        </View>
      </View>
    </ScrollView>
  </BottomSheet>
);
