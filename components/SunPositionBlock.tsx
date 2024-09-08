import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native';
import { converToTime } from 'utils';
import { LineChart } from 'react-native-chart-kit';
import { WeatherForCityType } from 'types/api';
import { Icon } from 'components';

interface Props {
  data: WeatherForCityType;
}

export const SunPositionBlock: React.FC<Props> = ({ data }) => {
  return (
    <View className="bg-zinc-900 mr-2 w-[48.8%] h-48 rounded-2xl py-3 px-3 relative">
      <View className="flex-row justify-between">
        <View className="mr-4 items-center">
          <View className="flex-row">
            <Icon name="Sunrise" width="19" height="19" stroke="#7F7F7F" />
            <Text className="text-zinc-500 font-medium pl-1">Sunrise</Text>
          </View>
          <Text className="text-white text-base font-medium mb-2">
            {converToTime(0, data.sys.sunrise)}
          </Text>
        </View>
        <View className="items-center">
          <View className="flex-row">
            <Icon name="Sunset" width="19" height="19" stroke="#7F7F7F" />
            <Text className="text-zinc-500 font-medium pl-1">Sunset</Text>
          </View>
          <Text className="text-white text-base font-medium">
            {converToTime(0, data.sys.sunset)}
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
  );
};
