import React from 'react';
import { View, Text } from 'react-native';
import { RangeSlider } from '@react-native-assets/slider';
import { DayliForecastType } from 'types/api';
import { temperatureRounding } from 'utils';
import { Icon } from 'components';

interface Props {
  data: DayliForecastType;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const FiveDayForecast: React.FC<Props> = ({ data }) => {
  return (
    <>
      <Text className="text-zinc-500 text-lg font-medium mb-2">5-day forecast</Text>
      {data.map((day, indx) => {
        const time = new Date(day.dt * 1000);

        return (
          <View key={day.dt} className="flex-row items-center justify-between mb-2.5 h-6">
            <Text className="text-white font-medium text-base">
              {!indx ? 'Today' : DAYS[time.getDay()]}
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
                {temperatureRounding(day.temp.day)}
              </Text>
              <Icon name={day.weather[0].main} width="20" height="20" fill="white" stroke="white" />
            </View>
          </View>
        );
      })}
    </>
  );
};
