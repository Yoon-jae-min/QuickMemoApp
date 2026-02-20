/**
 * 앱 전역 상수 (테마, 스토리지 키 등)
 */

export const STORAGE_KEYS = {
  MEMOS: '@QuickMemo:memos',
  DRAFT: '@QuickMemo:draft',
} as const;

export const LIMITS = {
  MAX_MEMOS: 500,
  DRAFT_MAX_LENGTH: 100_000,
} as const;

export const COLORS = {
  text: '#1E293B',
  textMuted: '#64748B',
  textPlaceholder: '#94A3B8',
  border: '#E2E8F0',
  background: '#F8FAFC',
  white: '#FFFFFF',
  primary: '#2563EB',
  danger: '#DC2626',
  dangerBg: '#FEF2F2',
  shadow: '#0F172A',
  overlay: 'rgba(15, 23, 42, 0.4)',
} as const;
