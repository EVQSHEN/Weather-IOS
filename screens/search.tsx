import React from 'react';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { FlatList } from 'react-native-gesture-handler';
import { Alert, Linking, StatusBar, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Animated,
} from 'react-native';
import { citylistType } from 'types/api';
import { getCityList } from 'api/api';
import { getMyFavoriteСities } from 'utils';
import { SearchCityBlock, Icon } from 'components';

const Search = () => {
  const navigation: any = useNavigation();

  const [searchValue, setSearchValue] = React.useState('');
  const [cityList, setCityList] = React.useState<citylistType[] | []>([]);
  const [subscribe, setSubscribe] = React.useState<{ city: string }[]>([]);
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

  const opacityAnim = React.useRef(new Animated.Value(1)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;

  function handleOpenSettings() {
    Linking.openSettings();
  }

  async function getLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission to access location was denied',
        'Please go to app settings and enable location access.',
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: 'Open Settings', onPress: handleOpenSettings },
        ],
      );
    }

    const location = await Location.getCurrentPositionAsync({});

    navigation.navigate('Weather', {
      coords: {
        lat: location.coords.latitude.toFixed(2),
        lon: location.coords.longitude.toFixed(2),
      },
    });
  }

  async function getMyFavoriteСitiesFunc() {
    const data = await getMyFavoriteСities();

    setSubscribe(data);
  }

  useFocusEffect(
    React.useCallback(() => {
      setSearchValue('');
      getMyFavoriteСitiesFunc();
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      return navigation.addListener('blur', () => {
        setCityList([]);
        Keyboard.dismiss();
      });
    }, [navigation]),
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  React.useEffect(() => {
    getMyFavoriteСitiesFunc();
  }, [subscribe.length]);

  React.useEffect(() => {
    async function getCityListFunc(value: string) {
      const data = await getCityList(value);

      setCityList(data);
    }

    if (searchValue !== '') {
      getCityListFunc(searchValue);
    }
  }, [searchValue]);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);

      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      Animated.timing(translateY, {
        toValue: -50,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);

      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-black relative">
        <StatusBar barStyle="light-content" />
        <SafeAreaView className="mx-3">
          <Animated.Text
            style={{ opacity: opacityAnim }}
            className="font-bold text-2xl text-white mb-5"
          >
            City list
          </Animated.Text>
          <Animated.View style={{ top: translateY }} className="relative">
            <View className="flex-row items-center justify-center h-14 mb-5">
              <View
                className={`bg-zinc-900 flex-row flex-1 items-center  ${
                  searchValue && cityList && isKeyboardVisible ? 'rounded-t-xl' : 'rounded-xl'
                } ${isKeyboardVisible ? '' : 'mr-2'}`}
              >
                <Icon name="Search" stroke="white" className="ml-3" />
                <TextInput
                  placeholder="Search"
                  value={searchValue}
                  onChangeText={(value) => setSearchValue(value)}
                  placeholderTextColor="gray"
                  className={`h-14 bg-zinc-900 flex-1 text-xl placeholder-zinc-100 text-zinc-300 p-2 pl-1 pb-3 rounded-r-xl`}
                />
              </View>
              {!isKeyboardVisible && (
                <TouchableOpacity
                  className="w-10 h-10 bg-lime-400 flex items-center justify-center rounded-full  pt-1"
                  onPress={() => getLocation()}
                >
                  <Icon name="Location" width="28" height="28" stroke="white" />
                </TouchableOpacity>
              )}
            </View>

            <View className="absolute w-full z-100 top-14 bg-zinc-900 rounded-b-xl">
              {cityList &&
                isKeyboardVisible &&
                searchValue !== '' &&
                cityList.map((el) => (
                  <TouchableOpacity
                    key={el.name}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      navigation.navigate('Weather', {
                        coords: {
                          value: el.name,
                        },
                      });
                    }}
                  >
                    <View className="flex-row items-center">
                      <Text className="text-white p-3 pr-2 text-lg">{el.name}</Text>
                      <Text className="text-gray-400 text-base">{el.country}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
            {isKeyboardVisible && <View className="absole w-full h-screen bg-black -z-10" />}
          </Animated.View>
        </SafeAreaView>
        <FlatList
          data={subscribe}
          style={{
            flexGrow: 1,
            height: 700,
            paddingHorizontal: 7,
            marginHorizontal: 2,
          }}
          renderItem={({ item }) => {
            return (
              <SearchCityBlock
                key={item.city}
                location={item.city}
                subscribe={subscribe}
                setSubscribe={setSubscribe}
              />
            );
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Search;
