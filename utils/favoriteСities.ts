import AsyncStorage from '@react-native-async-storage/async-storage';

export const getMyFavoriteСities = async () => {
  try {
    const value = await AsyncStorage.getItem('mySubscriptions');

    if (value) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
};
export const unsubscribeFromFavorites = async (location: string) => {
  try {
    const value = await AsyncStorage.getItem('mySubscriptions');
    const data = value && JSON.parse(value).filter((el) => el.city !== location);

    await AsyncStorage.setItem('mySubscriptions', JSON.stringify(data));

    return data;
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
};
