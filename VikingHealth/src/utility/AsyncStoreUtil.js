import { AsyncStorage } from 'react-native';

export const AsyncStoreKeys = {
  TOKEN: 'token',
  TOKEN_REGISTERED: 'token_registered',
  APPOINTMENT_COUNT: 'appointment_count',
};

export async function saveDataWithKey(data, key) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
}

export async function getDataWithKey(key, defaultData) {
  const data = await AsyncStorage.getItem(key);

  if (data === null || data === undefined) {
    return defaultData;
  }

  const parsedData = JSON.parse(data);

  return parsedData;
}
