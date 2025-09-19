import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setMapInstance(map: google.maps.Map) {
  await AsyncStorage.setItem('@map', JSON.stringify(map));
}

export async function getMapInstance(): Promise<string | null> {
  return await AsyncStorage.getItem('@map');
}
