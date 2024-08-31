import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'components';

const Error = () => {
  return (
    <SafeAreaView className="flex-1 bg-zinc-900 justify-center items-center">
      <Icon name="network" width="64" height="64" classComponent="mb-10" />
      <Text className="text-white font-medium text-6xl">ERROR</Text>
      <Text className="text-lime-400 text-xl mb-8">Network response</Text>
      <TouchableOpacity>
        <View className="w-36 h-12 bg-lime-400 rounded-xl flex justify-center items-center">
          <Text>retry</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Error;
