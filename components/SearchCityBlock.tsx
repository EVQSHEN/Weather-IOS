import React from 'react';
import * as Haptics from 'expo-haptics';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { unsubscribeFromFavorites, temperature } from '../assets/utils';
import { WeatherForCityType } from '../ts/api';
import { getWeatherForCity } from '../assets/api/api';
import { Icon } from '../components/Icon';
import { SearchCityBlockProps } from 'ts';

export const SearchCityBlock: React.FC<SearchCityBlockProps> = ({
  location,
  subscribe,
  setSubscribe,
}) => {
  const navigation: any = useNavigation();
  const swipeableRef = React.useRef();
  const [data, setData] = React.useState<WeatherForCityType | undefined>();
  const [index, setIndex] = React.useState<number>(0);
  const opacityAnim = React.useRef(new Animated.Value(100)).current;

  const updateLocationStatus = React.useCallback((locationKey: string) => {
    const updatedArray = subscribe.map((el) => {
      if (el.city === locationKey) {
        el.status = true;
      } else {
        el.status = false;
      }
      return el;
    });
    setSubscribe(updatedArray);
  }, []);

  const updateLocationStatusClose = React.useCallback(() => {
    const updatedArray = subscribe.map((el) => {
      if (el.city === location) {
        el.status = false;
      }
      return el;
    });
    setSubscribe(updatedArray);
  }, [setSubscribe]);

  React.useEffect(() => {
    getWeatherForCity(location, setData);
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
    data &&
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
  }, [data]);

  const rightSwipe = () => {
    return (
      <TouchableOpacity
        onPress={() => unsubscribeFromFavorites(location, setSubscribe)}
        className="flex justify-center items-center bg-lime-400 w-16 h-28 rounded-2xl"
      >
        <Icon name="delete" width="32px" height="32px" />
      </TouchableOpacity>
    );
  };

  return data ? (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={() => rightSwipe()}
      onSwipeableOpen={() => {
        updateLocationStatus(location);
      }}
      onSwipeableCloseStartDrag={() => updateLocationStatusClose()}
    >
      <TouchableOpacity
        activeOpacity={1.0}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.navigate('Weather', {
            myParam: {
              value: location,
            },
          });
        }}
      >
        <Animated.View
          style={{ opacity: opacityAnim }}
          className={`h-28 bg-zinc-900  flex-row justify-between items-center px-3 mb-3 rounded-2xl`}
        >
          <View className="flex-row items-center">
            <Icon
              name={data?.weather[0].main}
              stroke="#ffffff"
              fill="#ffffff"
              width="60"
              height="60"
              classComponent="mr-3"
            />
            <View>
              <Text className="text-white text-2xl font-medium">{location}</Text>
              <Text className="text-zinc-500 text-sm">{data?.weather[0].main}</Text>
            </View>
          </View>
          <View className="flex-row items-start justify-center">
            <Text className="text-6xl font-bold text-white">
              {data && temperature(data.main.temp)}
            </Text>
            <View className="w-2.5 h-2.5 bg-opacity-0 rounded-full border-2 border-white"></View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Swipeable>
  ) : (
    ''
  );
};

export default SearchCityBlock;
