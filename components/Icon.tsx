import { Image, ImageProps } from 'react-native';
import { SvgProps } from 'react-native-svg';
import SearchIcon from '../assets/svg/search.svg';
import LocationIcon from '../assets/svg/location.svg';
import NetworkIcon from '../assets/svg/network.svg';
import DeleteIcon from '../assets/svg/delete.svg';
import MenuIcon from '../assets/svg/menu.svg';
import sunriseIcon from '../assets/svg/sunrise.svg';
import sunsetIcon from '../assets/svg/sunset.svg';
import CloudsIcon from '../assets/svg/clouds.svg';
import HazeIcon from '../assets/svg/haze.svg';
import RainIcon from '../assets/svg/rain.svg';
import ClearIcon from '../assets/svg/clear.svg';
import ThunderstormIcon from '../assets/svg/thunderstorm.svg';
import DrizzleIcon from '../assets/svg/drizzle.svg';
import SnowIcon from '../assets/svg/snow.svg';
import UnfollowIcon from '../assets/svg/unfollow.svg';
import FollowIcon from '../assets/svg/follow.svg';
import ArrowIcon from '../assets/svg/arrow.svg';

const mapping = {
  Search: SearchIcon,
  Network: NetworkIcon,
  Location: LocationIcon,
  Delete: DeleteIcon,
  Menu: MenuIcon,
  Unfollow: UnfollowIcon,
  Follow: FollowIcon,
  Sunrise: sunriseIcon,
  Sunset: sunsetIcon,
  Clouds: CloudsIcon,
  Haze: HazeIcon,
  Rain: RainIcon,
  Clear: ClearIcon,
  Thunderstorm: ThunderstormIcon,
  Drizzle: DrizzleIcon,
  Snow: SnowIcon,
  Arrow: ArrowIcon,
};
8;
export type IconType = keyof typeof mapping;

export const Icon = ({
  name,
  ...restProps
}: { name: keyof typeof mapping; size?: number } & (SvgProps | ImageProps)) => {
  const IconComponent = mapping[name];

  if (!IconComponent) {
    return null;
  }

  if (typeof IconComponent === 'number') {
    // @ts-ignore
    return <Image name={name} source={IconComponent} {...restProps} />;
  }

  // @ts-ignore
  return <IconComponent name={name} {...restProps} />;
};
