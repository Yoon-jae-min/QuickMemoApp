import AsyncStorage from '@react-native-async-storage/async-storage';
import { Memo } from '../types';
import { STORAGE_KEYS, LIMITS } from '../constants';

const { MEMOS: MEMOS_KEY, DRAFT: DRAFT_KEY } = STORAGE_KEYS;
const { MAX_MEMOS, DRAFT_MAX_LENGTH } = LIMITS;

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
  content: string;
  savedAt: number;
}

export const saveDraft = async (content: string): Promise<void> => {
  try {
    if (!content.trim()) return;
    const trimmed = content.trim();
    if (trimmed.length > DRAFT_MAX_LENGTH) return;
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify({
      content: trimmed,
      savedAt: Date.now(),
    }));
  } catch (error) {
    if (__DEV__) console.error('Error saving draft:', error);
  }
};

export const getDraft = async (): Promise<Draft | null> => {
  try {
    const data = await AsyncStorage.getItem(DRAFT_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (typeof parsed?.content !== 'string' || typeof parsed?.savedAt !== 'number') return null;
    return { content: parsed.content, savedAt: parsed.savedAt };
  } catch (error) {
    if (__DEV__) console.error('Error getting draft:', error);
    return null;
  }
};

export const clearDraft = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    if (__DEV__) console.error('Error clearing draft:', error);
  }
};

