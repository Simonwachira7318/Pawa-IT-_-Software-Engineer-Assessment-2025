'use client';

import WeatherIcon from './WeatherIcon';
import { UnitType } from '../types/weather';

interface ForecastProps {
  items: {
    day: string;
    temp: number;
    icon: string;
  }[];
  unit: UnitType;
}

export default function Forecast({ items, unit }: ForecastProps) {
  return (
    <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4">3-Day Forecast</h3>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-blue-100">{item.day}</span>
            <div className="flex items-center gap-2">
              <WeatherIcon code={item.icon} size="sm" />
              <span className="font-mono">
                {unit === 'celsius' ? Math.round(item.temp) : Math.round(item.temp * 9/5 + 32)}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}