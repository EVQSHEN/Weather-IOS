import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'components';
import { formatTime, temperatureRounding } from 'utils';
import { HourlyForecastType } from 'types/api';

interface Props {
  data: HourlyForecastType[];
}

export const HourlyForecast: React.FC<Props> = ({ data }) => {
  return (
    <>
      <Text className="text-zinc-500 text-lg font-medium mb-2">Hourly forecast</Text>
      <View className="flex-row justify-between">
        {data.map((el, indx) => {
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
              <Text className="text-white text-lg font-bold">
                {temperatureRounding(el.main.temp)}
              </Text>
            </View>
          );
        })}
      </View>
    </>
  );
};
