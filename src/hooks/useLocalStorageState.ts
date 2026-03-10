import { useEffect, useState } from 'react';

function readStorage<T>(key: string, fallbackValue: T): T {
  if (typeof window === 'undefined') {
    return fallbackValue;
  }

  try {
    const saved = window.localStorage.getItem(key);
    if (!saved) {
      return fallbackValue;
    }

    const parsed = JSON.parse(saved) as unknown;

    // If initial value is an array, require the stored value to also be an array.
    if (Array.isArray(fallbackValue) && !Array.isArray(parsed)) {
      return fallbackValue;
    }

    return parsed as T;
  } catch {
    return fallbackValue;
  }
}

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Keep app usable when storage is unavailable.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
