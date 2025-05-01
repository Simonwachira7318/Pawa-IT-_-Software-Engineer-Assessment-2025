'use client';

import WeatherIcon from './WeatherIcon';
import { UnitType } from '../types/weather'; 

interface CurrentWeatherProps {
  data: {
    temp: number;
    description: string;
    icon: string;
    date: string;
    location: string;
  };
  unit: UnitType;
}

export default function CurrentWeather({ data, unit }: CurrentWeatherProps) {
  const displayTemp = unit === 'celsius' 
    ? `${Math.round(data.temp)}°C` 
    : `${Math.round(data.temp * 9/5 + 32)}°F`;

  return (
    <div className="flex flex-col items-center text-center">
      <WeatherIcon code={data.icon} size="xl" />
      <h1 className="text-6xl font-bold my-2">{displayTemp}</h1>
      <p className="text-xl text-blue-100">{data.description}</p>
      <p className="text-blue-200 mt-4">{data.date}</p>
      <p className="text-2xl font-semibold mt-2">{data.location}</p>
    </div>
  );
}