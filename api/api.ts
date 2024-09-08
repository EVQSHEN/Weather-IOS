import axios from 'axios';
const WEATHER_API = process.env.EXPO_PUBLIC_API_URL;
const CITY_API = process.env.EXPO_PUBLIC_API_CITY_KEY;
const API_URL = 'https://api.openweathermap.org/data/';

export async function getWeatherForCity(city = '', lat = 0, lon = 0) {
  const base_url = `${API_URL}2.5/weather?appid=${WEATHER_API}&units=metric&q=${city}&cnt=5`;
  const base_url_cord = `${API_URL}2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API}&units=metric`;

  let response;

  if (lat && lon && city === '') {
    const { data } = await axios.get(base_url_cord);
    response = data;
  } else {
    const { data } = await axios.get(base_url);
    response = data;
  }

  return response;
}
export async function getUVIndex(lat: number, lon: number) {
  const uv_url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max,uv_index_clear_sky_max&timezone=auto&forecast_days=1`;
  const response = await axios.get(uv_url);

  return response.data.daily.uv_index_max[0];
}

export async function getCityList(searchValue: string) {
  const response = await axios({
    method: 'get',
    url: 'https://api.api-ninjas.com/v1/city?limit=5&name=' + searchValue,
    headers: { 'X-Api-Key': CITY_API },
  });

  return response.data;
}

export async function getHourlyForecast(location: string) {
  const apiUrl = `${API_URL}2.5/forecast?appid=${WEATHER_API}&units=metric&q=${location}`;
  const response = await axios.get(apiUrl);

  return response.data.list.slice(0, 6);
}

export async function getFivedayForecast(lat = 0, lon = 0) {
  const apiUrl = `${API_URL}3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,current,alerts&units=metric&appid=${WEATHER_API}`;
  const response = await axios.get(apiUrl);

  return response.data.daily.slice(0, 5);
}
