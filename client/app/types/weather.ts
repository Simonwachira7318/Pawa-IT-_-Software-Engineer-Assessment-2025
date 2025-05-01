export type UnitType = 'celsius' | 'fahrenheit';

export interface CurrentWeatherData {
  temp: number;
  description: string;
  icon: string;
  date: string;
  location: string;
  wind: number;
  humidity: number;
}

export interface ForecastItem {
  day: string;
  temp: number;
  icon: string;
}

export interface WeatherData {
  current: CurrentWeatherData;
  forecast: ForecastItem[];
}