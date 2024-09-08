import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'components';

const Error = () => {
  const navigation: any = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-black justify-center items-center">
      <Icon name="Network" width="64" height="64" className="mb-10" />
      <Text className="text-white font-medium text-6xl">ERROR</Text>
      <Text className="text-lime-400 text-xl mb-8">Network response</Text>
      <TouchableOpacity>
        <View className="w-36 h-12 bg-lime-400 rounded-xl flex justify-center items-center">
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Text>Retry</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Error;
