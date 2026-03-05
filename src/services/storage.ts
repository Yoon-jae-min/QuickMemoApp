import AsyncStorage from '@react-native-async-storage/async-storage';
import { Memo } from '../types';
import { STORAGE_KEYS, LIMITS } from '../constants';

const { MEMOS: MEMOS_KEY, DRAFT: DRAFT_KEY } = STORAGE_KEYS;
const { MAX_MEMOS, DRAFT_MAX_LENGTH, MAX_DRAFTS, DRAFT_TTL_DAYS } = LIMITS;

function isMemo(m: unknown): m is Memo {
  return (
    typeof m === 'object' &&
    m !== null &&
    typeof (m as Memo).id === 'string' &&
    typeof (m as Memo).content === 'string' &&
    typeof (m as Memo).createdAt === 'number' &&
    typeof (m as Memo).updatedAt === 'number'
  );
}

function parseMemos(data: string | null): Memo[] {
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isMemo);
  } catch {
    return [];
  }
}

export const saveMemo = async (memo: Memo): Promise<void> => {
  try {
    const memos = await getMemos();
    const existingIndex = memos.findIndex(m => m.id === memo.id);

    if (existingIndex >= 0) {
      memos[existingIndex] = memo;
    } else {
      memos.unshift(memo);
      if (memos.length > MAX_MEMOS) {
        memos.length = MAX_MEMOS;
      }
    }

    await AsyncStorage.setItem(MEMOS_KEY, JSON.stringify(memos));
  } catch (error) {
    if (__DEV__) console.error('Error saving memo:', error);
    throw error;
  }
};

export const getMemos = async (): Promise<Memo[]> => {
  try {
    const data = await AsyncStorage.getItem(MEMOS_KEY);
    return parseMemos(data);
  } catch (error) {
    if (__DEV__) console.error('Error getting memos:', error);
    return [];
  }
};

export const deleteMemo = async (id: string): Promise<void> => {
  try {
    const memos = await getMemos();
    const filtered = memos.filter(m => m.id !== id);
    await AsyncStorage.setItem(MEMOS_KEY, JSON.stringify(filtered));
  } catch (error) {
    if (__DEV__) console.error('Error deleting memo:', error);
    throw error;
  }
};

export const clearAllMemos = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(MEMOS_KEY);
  } catch (error) {
    if (__DEV__) console.error('Error clearing memos:', error);
    throw error;
  }
};

export interface Draft {
  id: string;
  content: string;
  savedAt: number;
}

function parseDrafts(data: string | null): Draft[] {
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (d): d is Draft =>
          typeof d === 'object' &&
          d !== null &&
          typeof (d as Draft).id === 'string' &&
          typeof (d as Draft).content === 'string' &&
          typeof (d as Draft).savedAt === 'number',
      )
      .sort((a, b) => b.savedAt - a.savedAt);
  } catch {
    return [];
  }
}

function cleanupDrafts(list: Draft[]): Draft[] {
  const now = Date.now();
  const ttlMs = DRAFT_TTL_DAYS * 24 * 60 * 60 * 1000;
  const filtered = list.filter(d => now - d.savedAt <= ttlMs);
  if (filtered.length > MAX_DRAFTS) {
    return filtered.slice(0, MAX_DRAFTS);
  }
  return filtered;
}

export const getDrafts = async (): Promise<Draft[]> => {
  try {
    const data = await AsyncStorage.getItem(DRAFT_KEY);
    const parsed = parseDrafts(data);
    const cleaned = cleanupDrafts(parsed);
    if (cleaned.length !== parsed.length) {
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (error) {
    if (__DEV__) console.error('Error getting drafts:', error);
    return [];
  }
};

export const saveDraft = async (content: string): Promise<void> => {
  try {
    const trimmed = content.trim();
    if (!trimmed) return;
    if (trimmed.length > DRAFT_MAX_LENGTH) return;

    const current = await getDrafts();
    const now = Date.now();
    const newDraft: Draft = {
      id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
      content: trimmed,
      savedAt: now,
    };

    const next = cleanupDrafts([newDraft, ...current]);
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(next));
  } catch (error) {
    if (__DEV__) console.error('Error saving draft:', error);
  }
};

export const deleteDraft = async (id: string): Promise<void> => {
  try {
    const drafts = await getDrafts();
    const filtered = drafts.filter(d => d.id !== id);
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(filtered));
  } catch (error) {
    if (__DEV__) console.error('Error deleting draft:', error);
  }
};

export const clearDraft = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    if (__DEV__) console.error('Error clearing draft:', error);
  }
};

