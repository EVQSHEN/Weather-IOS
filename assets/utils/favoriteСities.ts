import AsyncStorage from '@react-native-async-storage/async-storage';

export const getMyFavoriteСities = async (setSubscribe) => {
  try {
    const value = await AsyncStorage.getItem('mySubscriptions');
    value && setSubscribe(JSON.parse(value));
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
};
export const unsubscribeFromFavorites = async (location: string, setSubscribe) => {
  try {
    const value = await AsyncStorage.getItem('mySubscriptions');
    const data = value && JSON.parse(value).filter((el) => el.city !== location);

    await AsyncStorage.setItem('mySubscriptions', JSON.stringify(data));
    setSubscribe(data);
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
};
