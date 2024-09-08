import React from 'react';
import { Slider } from '@react-native-assets/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { getUVDescription, getUVLevelDescription } from 'utils';

export const UvindexBlock: React.FC<{ uvIndex: number }> = ({ uvIndex }) => {
  return (
    <View className="bg-zinc-900 mr-2 w-[48.8%] h-48 rounded-2xl py-2 px-6">
      <Text className="text-zinc-500 text-lg font-medium mb-3">Uv index</Text>
      <View className="flex-1 justify-between mb-2">
        <View>
          <Text className=" text-white text-2xl">{Math.round(uvIndex)}</Text>
          <Text className=" text-white text-2xl">{getUVLevelDescription(uvIndex)}</Text>
        </View>
        <View>
          <View className="flex-1 items-center justify-center mb-4">
            <LinearGradient
              colors={['#0033A0', '#6FF41F', '#FFBF00', '#FF0026', '#B04AE0', '#C90816']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="h-[10px] w-full rounded-2xl overflow-hidden"
            >
              <Slider
                minimumValue={0}
                maximumValue={10}
                value={Math.round(uvIndex)}
                style={{
                  transform: [
                    {
                      translateY: -7,
                    },
                    {
                      translateX: 4,
                    },
                  ],
                }}
                thumbTintColor="#fff"
                minimumTrackTintColor="#transparent"
                maximumTrackTintColor="#transparent"
                thumbSize={11}
                enabled={false}
                thumbStyle={{
                  borderWidth: 1,
                  borderColor: 'black',
                }}
              />
            </LinearGradient>
          </View>
          <Text className="text-white">{getUVDescription(uvIndex)}</Text>
        </View>
      </View>
    </View>
  );
};
