'use client';

import { useWeatherData } from './hooks/useWeatherData';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import WeatherDetails from './components/WeatherDetails';
import UnitToggle from './components/UnitToggle';
import BatteryStatus from './components/BatteryStatus';
import Image from 'next/image';
// import PawaITLogo from '../../assets/logos/pawa-it-logo.png';

export default function Home() {
  const { weather, unit, loading, error, fetchWeather, toggleUnit } = useWeatherData();

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Image 
          src="https://pawait.africa/wp-content/uploads/2024/08/full-logo.png"
          alt="Pawa IT Logo"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
        <div className="flex items-center gap-4">
          <BatteryStatus level={75} />
          <UnitToggle unit={unit} onToggle={toggleUnit} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-800/80 to-purple-900/80 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
        <SearchBar onSearch={fetchWeather} />
        
        {loading && <div className="text-center py-12">Loading weather data...</div>}
        {error && <div className="text-red-300 text-center py-12">{error}</div>}
        
        {weather && (
          <div className="mt-6 space-y-8">
            <CurrentWeather data={weather.current} unit={unit} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <WeatherDetails 
                wind={weather.current.wind} 
                humidity={weather.current.humidity} 
              />
              <Forecast items={weather.forecast} unit={unit} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}