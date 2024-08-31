import axios from 'axios';
import {
  WeatherForCityResponseType,
  WeatherForCityType,
  citylistType,
  ForecastForCityType,
  DayliForecastType,
} from '../../ts/api';
const API_KEY = '32a1f53594d75e90bbf6752070efb77e';
const API_CITY_KEY = 'nVgpd7snHL22vftx2OyPAg==BvJkqV0t0PfZKyhm';
const API_URL = 'https://api.openweathermap.org/data/';

export async function getWeatherForCity(
  city = '',
  setData: React.Dispatch<React.SetStateAction<WeatherForCityType | undefined>>,
  lat = 0,
  lon = 0,
) {
  const base_url = `${API_URL}2.5/weather?appid=${API_KEY}&units=metric&q=${city}&cnt=5`;
  const base_url_cord = `${API_URL}2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  let response;

  if (lat && lon && city === '') {
    response = await axios.get(base_url_cord).then((response: WeatherForCityResponseType) => {
      return response.data;
    });
  } else {
    response = await axios.get(base_url).then((response: WeatherForCityResponseType) => {
      return response.data;
    });
  }

  setData({ ...response, uv_index: await getUVIndex(response.coord.lat, response.coord.lon) });
}
async function getUVIndex(lat, lon) {
  const uv_url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max,uv_index_clear_sky_max&timezone=auto&forecast_days=1`;
  let uv_index = 0;
  await axios.get(uv_url).then((response) => {
    uv_index = response.data.daily.uv_index_max[0];
  });
  return uv_index;
}

export function getCityList(
  searchValue: string,
  setCityList: React.Dispatch<React.SetStateAction<[] | citylistType[]>>,
) {
  const FULL_URL = 'https://api.api-ninjas.com/v1/city?limit=5&name=' + searchValue;
  axios({
    method: 'get',
    url: FULL_URL,
    headers: { 'X-Api-Key': API_CITY_KEY },
  }).then((response) => {
    setCityList(response.data);
  });
}

export async function getHourlyForecast(
  city: string,
  setHourlyForecast: React.Dispatch<React.SetStateAction<ForecastForCityType[] | undefined>>,
) {
  const apiUrl = `${API_URL}2.5/forecast?appid=${API_KEY}&units=metric&q=${city}`;
  axios.get(apiUrl).then((response) => {
    setHourlyForecast(response.data.list.slice(0, 6));
  });
}

export async function getFivedayForecast(
  lat = 0,
  lon = 0,
  setFivedayForecast: React.Dispatch<React.SetStateAction<DayliForecastType | undefined>>,
) {
  const apiUrl = `${API_URL}3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,current,alerts&units=metric&appid=${API_KEY}`;

  axios.get(apiUrl).then((response) => {
    setFivedayForecast(response.data.daily.slice(0, 5));
  });
}
