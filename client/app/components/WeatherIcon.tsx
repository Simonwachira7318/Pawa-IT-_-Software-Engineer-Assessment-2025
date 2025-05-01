'use client';

import { 
  WiDaySunny, 
  WiNightClear, 
  WiCloudy, 
  WiDayCloudy, 
  WiNightCloudy,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog
} from 'react-icons/wi';

interface WeatherIconProps {
  code: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  '01d': WiDaySunny,    // clear sky (day)
  '01n': WiNightClear,  // clear sky (night)
  '02d': WiDayCloudy,   // few clouds (day)
  '02n': WiNightCloudy, // few clouds (night)
  '03d': WiCloudy,      // scattered clouds
  '03n': WiCloudy,
  '04d': WiCloudy,      // broken clouds
  '04n': WiCloudy,
  '09d': WiRain,        // shower rain
  '09n': WiRain,
  '10d': WiRain,        // rain (day)
  '10n': WiRain,        // rain (night)
  '11d': WiThunderstorm,// thunderstorm
  '11n': WiThunderstorm,
  '13d': WiSnow,        // snow
  '13n': WiSnow,
  '50d': WiFog,         // mist
  '50n': WiFog
};

const sizeMap = {
  sm: 'text-xl',
  md: 'text-3xl',
  lg: 'text-5xl',
  xl: 'text-7xl'
};

export default function WeatherIcon({ code, size = 'md' }: WeatherIconProps) {
  const IconComponent = iconMap[code] || WiDaySunny;
  
  return (
    <div className={`${sizeMap[size]} text-yellow-300 animate-pulse`}>
      <IconComponent className="w-full h-full" />
    </div>
  );
}