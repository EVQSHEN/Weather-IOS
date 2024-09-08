import { Text } from 'react-native';
import { Image, View, StyleSheet, Dimensions } from 'react-native';
import { Icon } from './Icon';
const { height } = Dimensions.get('window');

interface Props {
  angle: number;
}

export const Compas: React.FC<Props> = ({ angle }) => {
  return (
    <View className="bg-zinc-900 w-[48.8%] mr-2 rounded-2xl h-48 py-2 px-6">
      <Text className="text-zinc-500 text-lg font-medium">Wind</Text>
      <View>
        {Number.isInteger(angle) && (
          <View style={styles.row}>
            <View style={styles.compassWrapper}>
              <Icon
                name="Arrow"
                width={28}
                height={28}
                style={[styles.arrow, { transform: [{ rotate: angle - 180 + 'deg' }] }]}
              />
              <Image
                source={require('../assets/img/compass_bg.png')}
                style={[styles.compass_bg, { transform: [{ rotate: -90 + 0 + 'deg' }] }]}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Compas;

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
  },
  compassWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  angle: {
    color: '#fff',
    fontSize: height / 25,
    marginBottom: 30,
  },
  arrow: {
    position: 'absolute',
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  compass_bg: {
    height: 140,
    width: 150,
    resizeMode: 'contain',
  },
});
