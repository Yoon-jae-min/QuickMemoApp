import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const POPUP_WIDTH = Math.min(SCREEN_WIDTH * 0.9, 500);

export const styles = StyleSheet.create({
  popupOnly: {
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  keyboardView: {
    alignItems: 'center',
  },
  popupContainer: {
    width: POPUP_WIDTH,
    maxWidth: 500,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 0,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    marginBottom: 4,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 6,
    marginBottom: 4,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 0,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  dangerText: {
    color: COLORS.danger,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderColor: 'transparent',
  },
  primaryButtonText: {
    color: COLORS.white,
  },
  textInput: {
    minHeight: 200,
    maxHeight: 400,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 0,
  },
});
