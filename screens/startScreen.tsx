import React from 'react';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { TextStroke } from '../components';
import elipse from '../assets/img/ellipse.png';
import cloudyNight from '../assets/img/cloudyNight.png';

const StartScreen = () => {
  const navigation: any = useNavigation();

  function handleClick() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate('Search');
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 flex-col justify-between items-left px-3">
        <View>
          <Image className="absolute -top-16 -left-3" source={elipse} />
          <Image className="absolute top-3 left-6" source={cloudyNight} />
        </View>
        <View className="mt-48">
          <Text className="text-white text-6xl font-bold">TRUSTED</Text>
          <TextStroke stroke={2} color={'#FFFFFF'}>
            <Text className="text-6xl font-bold">WEATHER</Text>
          </TextStroke>
          <Text className="text-white text-6xl font-bold">FORECAST</Text>
          <Text className="text-white text-xl">Get to know your weather maps</Text>
          <Text className="text-white text-xl"> and radar precipitation forecast</Text>
        </View>
        <TouchableOpacity onPress={() => handleClick()}>
          <View className="flex justify-center items-center m-2 h-14 bg-zinc-300 rounded-2xl">
            <Text className="font-bold text-xl">GET STARTED</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default StartScreen;
