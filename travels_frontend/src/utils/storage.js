import AsyncStorage from '@react-native-async-storage/async-storage';

// Save a key-value pair to storage.
export const saveToStorage = async (key, value) => {
  if (!key || typeof key !== 'string') {
    console.error('Invalid key');
    return;
  }
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log(`Saved ${key}`);
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    throw error;
  }
};

// Retrieve a value from storage by its key.
export const getFromStorage = async (key) => {
  if (!key || typeof key !== 'string') {
    console.error('Invalid key');
    return null;
  }
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    throw error;
  }
};

// Remove a key-value pair from storage.
export const removeFromStorage = async (key) => {
  if (!key || typeof key !== 'string') {
    console.error('Invalid key');
    return;
  }
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Removed ${key}`);
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    throw error;
  }
};

// Clear all data from storage.
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('Cleared all storage');
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

// Wrapper functions for easier token management.
export const getToken = async () => await getFromStorage('userToken');
export const removeToken = async () => await removeFromStorage('userToken');

// Save a token with expiry time.
export const saveTokenWithExpiry = async (key, value, expiryInSeconds = 3600) => {
  const expiry = Date.now() + expiryInSeconds * 1000;
  const valueWithExpiry = { value, expiry };
  await saveToStorage(key, valueWithExpiry);
};

// Retrieve a token with expiry check.
export const getTokenWithExpiry = async (key) => {
  const token = await getFromStorage(key);
  if (token && Date.now() < token.expiry) {
    return token.value;
  }
  await removeFromStorage(key);
  return null;
};