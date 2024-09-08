import React from 'react';
import * as Haptics from 'expo-haptics';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { unsubscribeFromFavorites, temperatureRounding } from '../utils';
import { WeatherForCityType } from '../types/api';
import { getWeatherForCity } from '../api/api';
import { Icon } from 'components';

interface Props {
  location: string;
  subscribe: { city: string; status?: boolean; loading?: boolean }[];
  setSubscribe: React.Dispatch<
    React.SetStateAction<
      {
        city: string;
        status?: boolean;
        loading?: boolean;
      }[]
    >
  >;
}

export const SearchCityBlock: React.FC<Props> = ({ location, subscribe, setSubscribe }) => {
  const navigation: any = useNavigation();
  const swipeableRef = React.useRef();

  const [data, setData] = React.useState<WeatherForCityType | undefined>();
  const [index, setIndex] = React.useState<number>(0);
  const opacityAnim = React.useRef(new Animated.Value(100)).current;

  async function getWeatherFunc() {
    try {
      const weather = await getWeatherForCity(location);

      setData(weather);
    } catch (err) {
      console.log(err);
      Haptics.NotificationFeedbackType.Error;
      navigation.navigate('Error');
    }
  }

  function handleNavigate() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Weather', {
      coords: {
        value: location,
      },
    });
  }

  async function unsubscribe(location: string) {
    const data = await unsubscribeFromFavorites(location);

    setSubscribe(data);
  }

  const updateLocationStatus = React.useCallback((locationKey: string) => {
    const updatedArray = subscribe.map((el) => {
      el.status = el.city === locationKey;

      return el;
    });

    setSubscribe(updatedArray);
  }, []);

  const updateLocationStatusClose = React.useCallback(() => {
    const updatedArray = subscribe.map((el) => {
      el.city === location ? (el.status = false) : (el.status = true);

      return el;
    });

    setSubscribe(updatedArray);
  }, [setSubscribe]);

  React.useEffect(() => {
    getWeatherFunc();

    const updatedArray = subscribe.map((item) => {
      if (item.city === location) {
        return { ...item, loading: true };
      }

      return item;
    });

    setSubscribe(updatedArray);
    setIndex(subscribe.findIndex((item) => item.city === location));
  }, []);

  React.useEffect(() => {
    if (!subscribe[index]?.status && swipeableRef.current) {
      swipeableRef.current.close();
    }
  }, [subscribe[index]?.status]);

  React.useEffect(() => {
    if (data) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [data]);

  const rightSwipe = () => {
    return (
      <TouchableOpacity
        onPress={() => unsubscribe(location)}
        className="flex justify-center items-center bg-lime-400 w-16 h-28 rounded-2xl"
      >
        <Icon name="Delete" width="32px" height="32px" />
      </TouchableOpacity>
    );
  };

  if (!data) {
    return null;
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={() => rightSwipe()}
      onSwipeableOpen={() => updateLocationStatus(location)}
      onSwipeableCloseStartDrag={() => updateLocationStatusClose()}
    >
      <TouchableOpacity activeOpacity={1.0} onPress={() => handleNavigate()}>
        <Animated.View
          style={{ opacity: opacityAnim }}
          className="h-28 bg-zinc-900  flex-row justify-between items-center px-3 mb-3 rounded-2xl"
        >
          <View className="flex-row items-center">
            <Icon
              // @ts-ignore
              name={data?.weather[0]?.main}
              stroke="#ffffff"
              fill="#ffffff"
              width="60"
              height="60"
              className="mr-3"
            />
            <View>
              <Text className="text-white text-2xl font-medium">{location}</Text>
              <Text className="text-zinc-500 text-sm">{data?.weather[0]?.main}</Text>
            </View>
          </View>
          <View className="flex-row items-start justify-center">
            <Text className="text-6xl font-bold text-white">
              {temperatureRounding(data.main.temp)}
            </Text>
            <View className="w-2.5 h-2.5 bg-opacity-0 rounded-full border-2 border-white" />
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default SearchCityBlock;
