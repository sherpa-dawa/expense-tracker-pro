import { Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const generateColorFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export const sortByKey = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (order === 'desc') {
      return a[key] > b[key] ? -1 : 1;
    }
    return a[key] > b[key] ? 1 : -1;
  });
};

export const filterByQuery = (items, query, keys) => {
  if (!query) return items;
  const lowerQuery = query.toLowerCase();
  return items.filter(item => 
    keys.some(key => 
      String(item[key]).toLowerCase().includes(lowerQuery)
    )
  );
};
