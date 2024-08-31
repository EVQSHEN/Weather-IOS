export type HomeScreenParams = {
  myParam: {
    value?: string;
    lat?: number;
    lon?: number;
  };
};

export type TextStrokeParams = {
  children: any;
  color: string;
  stroke: number;
};

export type SearchCityBlockProps = {
  location: string;
  subscribe: { city: string; status?: boolean; loading?: boolean }[];
  setSubscribe: React.Dispatch<
    React.SetStateAction<
      {
        city: string;
        status?: boolean;
        loading?: boolean;
      }[]
    >
  >;
};

export type IconProps = {
  name: string;
  width: string;
  height: string;
  classComponent?: string;
  stroke?: string;
  fill?: string;
};

export type HomeBasicBlockProps = {
  title: string;
  value: string;
  descriptopn: string;
  valeuDesciption?: string;
};

export type CompasProps = {
  angle: number;
};

export type paramsType = {
  myParam?: {
    value?: string;
    lat?: number;
    lon?: number;
  };
};
