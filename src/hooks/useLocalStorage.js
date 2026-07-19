import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item) setStoredValue(JSON.parse(item));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [key]);

  const setValue = useCallback(async (value) => {
    try {
      setStoredValue(value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) { console.error(e); }
  }, [key]);

  return [storedValue, setValue, loading];
};
