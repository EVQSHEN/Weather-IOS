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
import {
  formatSunTimeWithAMPM,
  temperature,
  formatTime,
  getMyFavoriteСities,
} from '../assets/utils';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { paramsType } from 'ts';
import { WeatherForCityType, ForecastForCityType, DayliForecastType } from 'ts/api';
import { getWeatherForCity, getHourlyForecast, getFivedayForecast } from '../assets/api/api';
import { LineChart } from 'react-native-chart-kit';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Compas, HomeBasicBlock, UvindexBlock, ContainerRow } from '../components';
import { RangeSlider } from '@react-native-assets/slider';

const Weather = () => {
  const route = useRoute();
  const param: paramsType = route.params || {};
  const navigation: any = useNavigation();
  const [data, setData] = React.useState<WeatherForCityType | undefined>();
  const [fiveDayForecast, setFiveDayForecast] = React.useState<DayliForecastType | undefined>();
  const [hourlyForecast, setHourlyForecast] = React.useState<ForecastForCityType[] | undefined>();
  const [favoriteСities, setFavoriteСities] = React.useState<any>();
  const [heightAnim, setHeightAnim] = React.useState(true);
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const opacityAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnimInverse = React.useRef(new Animated.Value(1)).current;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleScroll = (event: { nativeEvent: { contentOffset: { y: number } } }) => {
    const { y } = event.nativeEvent.contentOffset;
    setScrollPosition(y);
    if (y < 180) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setHeightAnim(true);
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setHeightAnim(false);
    }
    Animated.timing(opacityAnimInverse, {
      toValue: y < 180 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    Animated.timing(opacityAnim, {
      toValue: y < 180 ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    if (param.myParam && param.myParam.value) {
      getWeatherForCity(param.myParam.value, setData);
    } else {
      param.myParam &&
        param.myParam.lat &&
        param.myParam.lon &&
        getWeatherForCity('', setData, param.myParam.lat, param.myParam.lon);
    }
    getMyFavoriteСities(setFavoriteСities);
  }, []);

  React.useEffect(() => {
    if (data) {
      getFivedayForecast(data.coord.lat, data.coord.lon, setFiveDayForecast);
      getHourlyForecast(data.name, setHourlyForecast);
    }
  }, [data]);

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
    } catch (error) {
      console.log(error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };
  console.log(data);

  if (!data || !hourlyForecast || !fiveDayForecast) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator className="mb-2" size="large" color="#C0FF19" />
        <Text className="text-zinc-500">Loading</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black pb-3">
      <StatusBar barStyle="dark-content" />
      <Animated.View
        style={{ height: heightAnim ? 250 : 150 }}
        className={`w-full bg-lime-400 rounded-b-xl`}
      >
        <SafeAreaView className="">
          <View className="flex-row justify-between items-center relative mx-2">
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('Search');
              }}
            >
              <Icon name="menu" width="24" height="24" />
            </TouchableOpacity>
            <Text className="font-bold text-4xl">{data.name}</Text>
            <TouchableOpacity onPress={() => mySubscriptions(data.name)}>
              <Icon
                name={`${
                  favoriteСities?.some((city) => data.name == city.city) ? 'unfollow' : 'follow'
                }`}
                width="24"
                height="24"
              />
            </TouchableOpacity>
          </View>
          {(scrollPosition < 180 && (
            <Animated.View style={{ opacity: opacityAnimInverse, overflow: 'hidden' }}>
              <Text className="text-center text-lg mb-2">{data.sys.country}</Text>
              <View className="flex-row items-start justify-center">
                <Text className="text-6xl font-bold">{temperature(data.main.temp)}</Text>
                <View className="w-2.5 h-2.5 bg-opacity-0 rounded-full border-2 border-black"></View>
              </View>
              <View className="flex-row justify-center items-center mb-1">
                <Icon name={data.weather[0].main} width="24" height="24" classComponent="mr-2" />
                <Text>{data.weather[0].main}</Text>
              </View>
              <View className="flex-row justify-center items-center">
                <Text>{`H:${temperature(data.main.temp_max)}`}</Text>
                <View className="w-2 h-2 bg-black rounded-full mx-2"></View>
                <Text>{`L:${temperature(data.main.temp_min)}`}</Text>
              </View>
            </Animated.View>
          )) || (
            <Animated.View
              style={{ opacity: opacityAnim, overflow: 'hidden' }}
              className="flex-row justify-center items-center mt-2"
            >
              <View className="flex-row items-start justify-center mr-2">
                <Text className="text-2xl font-medium">{temperature(data.main.temp)}</Text>
                <View className="w-1.5 h-1.5 bg-opacity-0 rounded-full border-2 border-black mt-1"></View>
              </View>
              <Text className="text-lg font-medium">{data.weather[0].main}</Text>
            </Animated.View>
          )}
        </SafeAreaView>
      </Animated.View>

      <ScrollView onScroll={handleScroll} scrollEventThrottle={1} className="bg-black">
        <ContainerRow className="mx-1.5 mt-2 w-fit h-44 bg-zinc-900 rounded-2xl py-4 px-7 mb-2 flex-col">
          <Text className="text-zinc-500 text-lg font-medium mb-2">Hourly forecast</Text>
          <View className="flex-row justify-between">
            {hourlyForecast.map((el, indx) => {
              return (
                <View key={el.dt_txt} className="h-24 flex justify-between items-center">
                  <Text className="text-white text-base">
                    {indx === 0 ? 'Now' : formatTime(el.dt_txt)}
                  </Text>
                  <Icon
                    name={el.weather[0].main}
                    width="24"
                    height="24"
                    stroke="#ffff"
                    fill="#ffffff"
                  />
                  <Text className="text-white text-lg font-bold">{temperature(el.main.temp)}</Text>
                </View>
              );
            })}
          </View>
        </ContainerRow>

        <ContainerRow className="w-fit flex-col h-58 py-4 px-7 mx-1.5 bg-zinc-900 rounded-2xl">
          <Text className="text-zinc-500 text-lg font-medium mb-2">5-day forecast</Text>
          {fiveDayForecast?.map((day, indx) => {
            const time = new Date(day.dt * 1000);
            return (
              <View key={day.dt} className="flex-row items-center justify-between mb-2.5 h-6">
                <Text className="text-white font-medium text-base">
                  {!indx ? 'Today' : days[time.getDay()]}
                </Text>
                <View className="flex-row justify-center items-center">
                  <Text className="mr-3 w-4 text-right font-medium text-[#909090]">
                    {day.temp.night}
                  </Text>
                  <View style={{ width: 120, height: 20 }}>
                    <RangeSlider
                      range={[
                        day.temp.day >= day.temp.night ? day.temp.night : day.temp.day,
                        day.temp.day > day.temp.night ? day.temp.day : day.temp.night,
                      ]}
                      minimumValue={day.temp.min - 2}
                      maximumValue={day.temp.max + 2}
                      outboundColor="#323232"
                      inboundColor="#c0ff19"
                      thumbTintColor="darkcyan"
                      thumbSize={0}
                      enabled={false}
                      style={{ flex: 1 }}
                    />
                  </View>
                  <Text className="text-white text-right mx-3 w-4 font-medium ">
                    {temperature(day.temp.day)}
                  </Text>
                  <Icon
                    name={day.weather[0].main}
                    width="20"
                    height="20"
                    fill="white"
                    stroke="white"
                  />
                </View>
              </View>
            );
          })}
        </ContainerRow>

        <ContainerRow>
          <UvindexBlock uvIndex={data.uv_index} />
          <View className="bg-zinc-900 mr-2  w-[calc(50%-1.2%)] h-48 rounded-2xl py-3 px-3 relative">
            <View className="flex-row justify-between">
              <View className="mr-4 items-center">
                <View className="flex-row">
                  <Icon name="sunrise" width="19" height="19" stroke="#7F7F7F" />
                  <Text className="text-zinc-500 font-medium pl-1">Sunrise</Text>
                </View>
                <Text className="text-white text-base font-medium mb-2">
                  {formatSunTimeWithAMPM(0, data.sys.sunrise)}
                </Text>
              </View>
              <View className="items-center">
                <View className="flex-row">
                  <Icon name="sunset" width="19" height="19" stroke="#7F7F7F" />
                  <Text className="text-zinc-500 font-medium pl-1">Sunset</Text>
                </View>
                <Text className="text-white text-base font-medium">
                  {formatSunTimeWithAMPM(0, data.sys.sunset)}
                </Text>
              </View>
            </View>
            <View className="ml-3 absolute top-14">
              <LineChart
                data={{
                  labels: ['Sunset', '', 'Sunrise'],
                  datasets: [
                    {
                      data: [data.sys.sunrise, data.sys.sunset + 2500000, data.sys.sunset],
                      color: (opacity = 1) => `rgba(192, 255, 25, ${opacity})`,
                    },
                  ],
                }}
                width={240}
                height={120}
                yAxisInterval={10}
                yLabelsOffset={-1000}
                xLabelsOffset={-10}
                withOuterLines={false}
                transparent={true}
                withInnerLines={false}
                hidePointsAtIndex={[1]}
                chartConfig={{
                  backgroundColor: '#e26a00',
                  backgroundGradientFrom: '#fb8c00',
                  backgroundGradientTo: '#ffa726',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                bezier
                style={{
                  marginVertical: 0,
                  marginLeft: -34,
                  borderRadius: 16,
                }}
              />
            </View>
          </View>
        </ContainerRow>

        <ContainerRow>
          <Compas angle={data.wind.deg} />
          <HomeBasicBlock
            title="Feels like"
            value={`${temperature(data.main.feels_like)}`}
            descriptopn={
              data.main.feels_like < data.main.temp
                ? 'Feels colder than the actual temperature.'
                : data.main.feels_like > data.main.temp
                ? 'Feels warmer than the actual temperature.'
                : 'Feels like the actual temperature.'
            }
          />
        </ContainerRow>

        <ContainerRow>
          <HomeBasicBlock
            title="Pressure"
            value={`${data.main.pressure}hPa`}
            descriptopn={
              data.main.pressure < 1000
                ? 'Low pressure. Expect changes in the weather.'
                : data.main.pressure >= 1000 && data.main.pressure <= 1010
                ? 'Normal pressure. Typical weather conditions.'
                : 'High pressure. Expect stable and clear weather.'
            }
          />
          <HomeBasicBlock
            title="Humidity"
            value={`${data.main.humidity}%`}
            descriptopn={
              data.main.humidity < 40
                ? 'Low humidity. It might feel dry.'
                : data.main.humidity < 70
                ? 'Moderate humidity. Comfortable conditions.'
                : 'High humidity. It might feel humid and uncomfortable.'
            }
          />
        </ContainerRow>

        <ContainerRow>
          <HomeBasicBlock
            title="Visibility"
            value={`${data.visibility / 1000}km`}
            descriptopn={
              data.visibility >= 10
                ? "It's perfectly clear right now."
                : data.visibility >= 5
                ? 'Good visibility.'
                : 'Poor visibility. Exercise caution while driving or moving around.'
            }
          />
          <HomeBasicBlock
            title="Precipitation"
            value={`${data.rain?.['1h'] || 0}mm`}
            valeuDesciption="in the last 3h"
            descriptopn={
              data.rain?.['1h'] !== undefined
                ? data.rain['1h'] <= 0.2
                  ? 'Light rain or drizzle. An umbrella may come in handy.'
                  : data.rain['1h'] <= 2.5
                  ? 'Moderate rain.'
                  : 'Heavy rain.'
                : 'Conditions are dry.'
            }
          />
        </ContainerRow>
      </ScrollView>
    </View>
  );
};
export default Weather;
