export type UnitType = 'celsius' | 'fahrenheit';

export interface WeatherData {
  current: {
    temp: number;
    description: string;
    icon: string;
    date: string;
    location: string;
    wind: number;
    humidity: number;
  };
  forecast: Array<{
    day: string;
    temp: number;
    icon: string;
  }>;
}

export interface Location {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}