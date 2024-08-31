import React from 'react';
import { View, Text } from 'react-native';
import { HomeBasicBlockProps } from 'ts';

export const HomeBasicBlock: React.FC<HomeBasicBlockProps> = ({
  title,
  value,
  descriptopn,
  valeuDesciption,
}) => {
  return (
    <View className="bg-zinc-900 mr-2  w-[calc(50%-1.2%)] h-48 rounded-2xl py-2 px-6">
      <Text className="text-zinc-500 text-lg font-medium mb-3">{title}</Text>
      <View className="flex-1 justify-between mb-2">
        <View>
          <View className="flex-row items-start">
            <Text className={`text-white ${title !== 'Feels like' ? 'text-2xl' : 'text-3xl'}`}>
              {value}
            </Text>
            {title === 'Feels like' && (
              <View className="w-2 h-2 ml-1 bg-opacity-0 mt-1 rounded-full border-2 border-white"></View>
            )}
          </View>
          {valeuDesciption && <Text className="text-white text-2xl">{valeuDesciption}</Text>}
        </View>
        <Text className="text-white">{descriptopn}</Text>
      </View>
    </View>
  );
};

export default HomeBasicBlock;
