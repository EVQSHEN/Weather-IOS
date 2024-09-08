import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  LayoutAnimation,
  StatusBar,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherForCityType, HourlyForecastType, DayliForecastType } from 'types/api';
import { getWeatherForCity, getHourlyForecast, getFivedayForecast, getUVIndex } from 'api/api';
import {
  temperatureRounding,
  getMyFavoriteСities,
  getHumidityDescription,
  getVisibilityDescription,
  getPrecipitationDescription,
  getPressureDescription,
  getFeelsLikeDescription,
} from 'utils';
import {
  Icon,
  Compas,
  HomeBasicBlock,
  UvindexBlock,
  ContainerRow,
  HourlyForecast,
  FiveDayForecast,
  SunPositionBlock,
} from '../components';

interface ParamsInterface {
  coords?: {
    value?: string;
    lat?: number;
    lon?: number;
  };
}

const SCROLL_ANIMATION_START_HEIGHT = 180;

const Weather = () => {
  const route = useRoute();
  const param: ParamsInterface = route.params || {};
  const navigation: any = useNavigation();

  const [favoriteСities, setFavoriteСities] = React.useState<any>();
  const [data, setData] = React.useState<WeatherForCityType | undefined>();
  const [uvIndex, setUVIndex] = React.useState<number | undefined>();
  const [fiveDayForecast, setFiveDayForecast] = React.useState<DayliForecastType | undefined>();
  const [hourlyForecast, setHourlyForecast] = React.useState<HourlyForecastType[] | undefined>();

  const [heightAnim, setHeightAnim] = React.useState(true);
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const opacityAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnimInverse = React.useRef(new Animated.Value(1)).current;

  const headerHeight = heightAnim ? 250 : 150;
  const isFollowed = favoriteСities?.some((city: any) => data?.name == city.city)
    ? 'Unfollow'
    : 'Follow';

  async function getWeatherFunc() {
    try {
      if (param.coords && param.coords.value) {
        const data = await getWeatherForCity(param.coords.value);

        setData(data);
      } else if (param.coords?.lat) {
        const data = await getWeatherForCity('', param.coords.lat, param.coords.lon);

        setData(data);
      }
    } catch (err) {
      console.log(err);
      Haptics.NotificationFeedbackType.Error;
      navigation.navigate('Error');
    }
  }

  async function getUVIndexFunc(lat: number, lon: number) {
    try {
      const response = await getUVIndex(lat, lon);

      setUVIndex(response);
    } catch (err) {
      console.log(err);
      Haptics.NotificationFeedbackType.Error;
      navigation.navigate('Error');
    }
  }

  async function getHourlyForecastFunc(location: string) {
    try {
      const response = await getHourlyForecast(location);

      setHourlyForecast(response);
    } catch (err) {
      console.log(err);
      Haptics.NotificationFeedbackType.Error;
      navigation.navigate('Error');
    }
  }

  async function getFivedayForecastFunc(lat: number, lon: number) {
    try {
      const response = await getFivedayForecast(lat, lon);

      setFiveDayForecast(response);
    } catch (err) {
      console.log(err);
      Haptics.NotificationFeedbackType.Error;
      navigation.navigate('Error');
    }
  }

  async function getMyFavoriteСitiesFunc() {
    const data = await getMyFavoriteСities();

    setFavoriteСities(data);
  }

  const mySubscriptions = async (city: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setFavoriteСities((prevCities: { city: string }[]) => {
        const cityExists = prevCities?.some((item) => item.city === city);
        let updatedCities;

        if (cityExists) {
          updatedCities = prevCities.filter((item) => item.city !== city);
        } else {
          updatedCities = [...prevCities, { city }];
        }
        AsyncStorage.setItem('mySubscriptions', JSON.stringify(updatedCities));

        return updatedCities;
      });
    } catch (err) {
      console.log(err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      navigation.navigate('Error');
    }
  };

  const handleScroll = (event: { nativeEvent: { contentOffset: { y: number } } }) => {
    const { y } = event.nativeEvent.contentOffset;
    setScrollPosition(y);

    if (y < SCROLL_ANIMATION_START_HEIGHT) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setHeightAnim(true);
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setHeightAnim(false);
    }

    Animated.timing(opacityAnimInverse, {
      toValue: y < SCROLL_ANIMATION_START_HEIGHT ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(opacityAnim, {
      toValue: y < SCROLL_ANIMATION_START_HEIGHT ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  function handleNavigate() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Search');
  }

  React.useEffect(() => {
    getWeatherFunc();
    getMyFavoriteСitiesFunc();
  }, []);

  React.useEffect(() => {
    if (data) {
      getUVIndexFunc(data.coord.lat, data.coord.lon);
      getFivedayForecastFunc(data.coord.lat, data.coord.lon);
      getHourlyForecastFunc(data.name);
    }
  }, [data]);

  if (!data || !hourlyForecast || !fiveDayForecast || !uvIndex) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator className="mb-2" size="large" color="#C0FF19" />
        <Text className="text-zinc-500">Loading</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black pb-2">
      <StatusBar barStyle="dark-content" />
      <Animated.View style={{ height: headerHeight }} className={`w-full bg-lime-400 rounded-b-xl`}>
        <SafeAreaView>
          <View className="flex-row justify-between items-center relative mx-2">
            <TouchableOpacity onPress={() => handleNavigate()}>
              <Icon name="Menu" width="24" height="24" />
            </TouchableOpacity>
            <Text className="font-bold text-4xl">{data.name}</Text>
            <TouchableOpacity onPress={() => mySubscriptions(data.name)}>
              <Icon name={isFollowed} width="24" height="24" />
            </TouchableOpacity>
          </View>
          {(scrollPosition < SCROLL_ANIMATION_START_HEIGHT && (
            <Animated.View style={{ opacity: opacityAnimInverse, overflow: 'hidden' }}>
              <Text className="text-center text-lg mb-2">{data.sys.country}</Text>
              <View className="flex-row items-start justify-center">
                <Text className="text-6xl font-bold">{temperatureRounding(data.main.temp)}</Text>
                <View className="w-2.5 h-2.5 bg-opacity-0 rounded-full border-2 border-black" />
              </View>
              <View className="flex-row justify-center items-center mb-1">
                <Icon
                  name={data.weather[0].main}
                  stroke="black"
                  width="24"
                  height="24"
                  className="mr-2"
                />
                <Text>{data.weather[0].main}</Text>
              </View>
              <View className="flex-row justify-center items-center">
                <Text>{`H:${temperatureRounding(data.main.temp_max)}`}</Text>
                <View className="w-2 h-2 bg-black rounded-full mx-2" />
                <Text>{`L:${temperatureRounding(data.main.temp_min)}`}</Text>
              </View>
            </Animated.View>
          )) || (
            <Animated.View
              style={{ opacity: opacityAnim, overflow: 'hidden' }}
              className="flex-row justify-center items-center mt-2"
            >
              <View className="flex-row items-start justify-center mr-2">
                <Text className="text-2xl font-medium">{temperatureRounding(data.main.temp)}</Text>
                <View className="w-1.5 h-1.5 bg-opacity-0 rounded-full border-2 border-black mt-1" />
              </View>
              <Text className="text-lg font-medium">{data.weather[0].main}</Text>
            </Animated.View>
          )}
        </SafeAreaView>
      </Animated.View>

      <ScrollView onScroll={handleScroll} scrollEventThrottle={1} className="bg-black">
        <ContainerRow className="mx-1.5 mt-2 w-fit h-44 bg-zinc-900 rounded-2xl py-4 px-7 mb-2 flex-col">
          <HourlyForecast data={hourlyForecast} />
        </ContainerRow>

        <ContainerRow className="flex-col h-58 py-4 px-7 bg-zinc-900">
          <FiveDayForecast data={fiveDayForecast} />
        </ContainerRow>

        <ContainerRow>
          <UvindexBlock uvIndex={uvIndex} />
          <SunPositionBlock data={data} />
        </ContainerRow>

        <ContainerRow>
          <Compas angle={data.wind.deg} />
          <HomeBasicBlock
            title="Feels like"
            value={`${temperatureRounding(data.main.feels_like)}`}
            description={getFeelsLikeDescription(data.main.feels_like, data.main.temp)}
          />
        </ContainerRow>

        <ContainerRow>
          <HomeBasicBlock
            title="Pressure"
            value={`${data.main.pressure}hPa`}
            description={getPressureDescription(data.main.pressure)}
          />
          <HomeBasicBlock
            title="Humidity"
            value={`${data.main.humidity}%`}
            description={getHumidityDescription(data.main.humidity)}
          />
        </ContainerRow>

        <ContainerRow>
          <HomeBasicBlock
            title="Visibility"
            value={`${data.visibility / 1000}km`}
            description={getVisibilityDescription(data.visibility)}
          />
          <HomeBasicBlock
            title="Precipitation"
            value={`${data.rain?.['1h'] || 0}mm`}
            valeuDesciption="in the last 3h"
            description={getPrecipitationDescription(data.rain?.['1h'])}
          />
        </ContainerRow>
      </ScrollView>
    </View>
  );
};
export default Weather;
