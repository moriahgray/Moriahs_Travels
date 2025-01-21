import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save a key-value pair to storage.
 * @param {string} key 
 * @param {any} value
 */
export const saveToStorage = async (key, value) => {
  if (!key || typeof key !== 'string') {
    console.error('saveToStorage called with an undefined or invalid key');
    return;
  }
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log(`Saved ${key} to storage`);
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
    throw error;
  }
};

/**
 * Retrieve a value from storage by its key.
 * @param {string} key 
 * @returns {any|null}
 */
export const getFromStorage = async (key) => {
  if (!key || typeof key !== 'string') {
    console.error('getFromStorage called with an undefined or invalid key');
    return null;
  }
  try {
    console.log(`Fetching key from storage: ${key}`);
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error retrieving ${key} from storage:`, error);
    throw error;
  }
};

/**
 * Remove a key-value pair from storage.
 * @param {string} key - The key of the value to remove.
 */
export const removeFromStorage = async (key) => {
  if (!key || typeof key !== 'string') {
    console.error('removeFromStorage called with an undefined or invalid key');
    return;
  }
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Removed ${key} from storage`);
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
    throw error;
  }
};

/**
 * Clear all data from storage.
 */
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('Cleared all storage');
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

/**
 * Wrapper functions for better usage in app.
 */
export const getToken = async () => await getFromStorage('userToken');
export const removeToken = async () => await removeFromStorage('userToken');
