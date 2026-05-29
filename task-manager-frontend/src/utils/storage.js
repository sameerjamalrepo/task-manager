import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const getStoredItem = async (key) => {
  if (Platform.OS === 'web') {
    return window.localStorage.getItem(key);
  }

  return SecureStore.getItemAsync(key);
};

export const setStoredItem = async (key, value) => {
  if (Platform.OS === 'web') {
    window.localStorage.setItem(key, value);
    return;
  }

  return SecureStore.setItemAsync(key, value);
};

export const deleteStoredItem = async (key) => {
  if (Platform.OS === 'web') {
    window.localStorage.removeItem(key);
    return;
  }

  return SecureStore.deleteItemAsync(key);
};
