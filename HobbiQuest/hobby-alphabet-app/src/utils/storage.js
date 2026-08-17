import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'hobby-alphabet:entries';

// entries shape: { A: { hobbyName, note, rating, photoUri, dateCompleted }, ... }

export async function loadEntries() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn('Failed to load entries', e);
    return {};
  }
}

export async function saveEntry(letter, entry) {
  try {
    const entries = await loadEntries();
    entries[letter] = entry;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return entries;
  } catch (e) {
    console.warn('Failed to save entry', e);
    throw e;
  }
}

export async function deleteEntry(letter) {
  try {
    const entries = await loadEntries();
    delete entries[letter];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return entries;
  } catch (e) {
    console.warn('Failed to delete entry', e);
    throw e;
  }
}

export async function clearAllEntries() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear entries', e);
  }
}
