// Safe font loader - falls back to system fonts if custom fonts aren't available
import { Platform } from 'react-native';

export const FONTS = {
  Regular: Platform.select({
    ios: 'Inter-Regular',
    android: 'Inter-Regular',
    default: undefined,
  }),
  Medium: Platform.select({
    ios: 'Inter-Medium',
    android: 'Inter-Medium',
    default: undefined,
  }),
  SemiBold: Platform.select({
    ios: 'Inter-SemiBold',
    android: 'Inter-SemiBold',
    default: undefined,
  }),
  Bold: Platform.select({
    ios: 'Inter-Bold',
    android: 'Inter-Bold',
    default: undefined,
  }),
};

// If fonts fail to load, this returns system font
export const getFontFamily = (weight = 'Regular') => {
  return FONTS[weight] || undefined;
};
