'use client';

import { WiStrongWind, WiHumidity } from 'react-icons/wi';

interface WeatherDetailsProps {
  wind: number;
  humidity: number;
}

export default function WeatherDetails({ wind, humidity }: WeatherDetailsProps) {
  return (
    <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4">Weather Details</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <WiStrongWind className="text-2xl text-blue-300" />
          <div>
            <p className="text-blue-100">Wind Speed</p>
            <p className="font-mono">{wind} km/h</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <WiHumidity className="text-2xl text-blue-300" />
          <div>
            <p className="text-blue-100">Humidity</p>
            <p className="font-mono">{humidity}%</p>
          </div>
        </div>
        
        <div className="pt-4">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" 
              style={{ width: `${humidity}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}