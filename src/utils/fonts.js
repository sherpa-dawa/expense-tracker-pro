// Font utility with system fallback
export const getFont = (weight = 'Regular') => {
  const fontMap = {
    'Regular': 'Inter-Regular',
    'Medium': 'Inter-Medium', 
    'SemiBold': 'Inter-SemiBold',
    'Bold': 'Inter-Bold',
  };
  return fontMap[weight] || 'Inter-Regular';
};

// If custom fonts fail to load, these system fallbacks are used
export const fontFallbacks = {
  'Inter-Regular': undefined,      // Uses system default
  'Inter-Medium': undefined,
  'Inter-SemiBold': undefined,
  'Inter-Bold': undefined,
};
