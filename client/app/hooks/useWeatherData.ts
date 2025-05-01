/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { WeatherData, UnitType } from '../types/weather';
import { API_BASE_URL } from '../config/api';

export const useWeatherData = (initialLocation = 'Nairobi') => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<UnitType>('celsius');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (location: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/weather?location=${encodeURIComponent(location)}&units=${unit === 'celsius' ? 'metric' : 'imperial'}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch weather data');
      
      const data = await response.json();
      setWeather({
        current: {
          temp: data.current.temp,
          description: data.current.description,
          icon: data.current.icon,
          date: data.current.date,
          location: data.current.location,
          wind: data.current.wind,
          humidity: data.current.humidity
        },
        forecast: data.forecast
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(initialLocation);
  }, [initialLocation, unit]);

  const toggleUnit = () => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  return { weather, unit, loading, error, fetchWeather, toggleUnit };
};