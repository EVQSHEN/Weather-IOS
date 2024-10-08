import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  title: string;
  value: string;
  description: string;
  valeuDesciption?: string;
}

export const HomeBasicBlock: React.FC<Props> = ({ title, value, description, valeuDesciption }) => {
  return (
    <View className="bg-zinc-900 mr-2 w-[48.8%] h-48 rounded-2xl py-2 px-6">
      <Text className="text-zinc-500 text-lg font-medium mb-3">{title}</Text>
      <View className="flex-1 justify-between mb-2">
        <View>
          <View className="flex-row items-start">
            <Text className={`text-white ${title !== 'Feels like' ? 'text-2xl' : 'text-3xl'}`}>
              {value}
            </Text>
            {title === 'Feels like' && (
              <View className="w-2 h-2 ml-1 bg-opacity-0 mt-1 rounded-full border-2 border-white" />
            )}
          </View>
          <Text className="text-white text-2xl">{valeuDesciption}</Text>
        </View>
        <Text className="text-white">{description}</Text>
      </View>
    </View>
  );
};

export default HomeBasicBlock;
