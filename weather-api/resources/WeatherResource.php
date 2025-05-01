<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;

class OpenWeatherMapService
{
    private Client $client;
    private string $apiKey;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'https://api.openweathermap.org',
            'timeout' => 10,
            'verify' => false, // Only for development, remove in production
        ]);

        $this->apiKey = config('services.openweathermap.key');
    }

    /**
     * Get current weather data for a location
     *
     * @param string $location
     * @param string $units
     * @return array
     * @throws \Exception
     */
    public function getCurrentWeather(string $location, string $units = 'metric'): array
    {
        try {
            $response = $this->client->get('/data/2.5/weather', [
                'query' => [
                    'q' => $location,
                    'appid' => $this->apiKey,
                    'units' => $units,
                    'lang' => 'en',
                ]
            ]);

            $data = json_decode($response->getBody(), true);

            return $this->transformCurrentWeatherData($data);

        } catch (GuzzleException $e) {
            Log::error('OpenWeatherMap API Error: ' . $e->getMessage());
            throw new \Exception('Could not fetch weather data: ' . $e->getMessage());
        }
    }

    /**
     * Get weather forecast for a location
     *
     * @param string $location
     * @param string $units
     * @return array
     * @throws \Exception
     */
    public function getForecast(string $location, string $units = 'metric'): array
    {
        try {
            $response = $this->client->get('/data/2.5/forecast', [
                'query' => [
                    'q' => $location,
                    'appid' => $this->apiKey,
                    'units' => $units,
                    'cnt' => 24, // Get 24 forecasts (3 days)
                ]
            ]);

            $data = json_decode($response->getBody(), true);

            return $this->transformForecastData($data);

        } catch (GuzzleException $e) {
            Log::error('OpenWeatherMap Forecast API Error: ' . $e->getMessage());
            throw new \Exception('Could not fetch forecast data: ' . $e->getMessage());
        }
    }

    /**
     * Geocode a location name into coordinates
     *
     * @param string $query
     * @return array
     * @throws \Exception
     */
    public function geocode(string $query): array
    {
        try {
            $response = $this->client->get('/geo/1.0/direct', [
                'query' => [
                    'q' => $query,
                    'limit' => 5,
                    'appid' => $this->apiKey,
                ]
            ]);

            $data = json_decode($response->getBody(), true);

            return array_map(function ($location) {
                return [
                    'name' => $location['name'],
                    'country' => $location['country'],
                    'state' => $location['state'] ?? null,
                    'lat' => $location['lat'],
                    'lon' => $location['lon'],
                ];
            }, $data);

        } catch (GuzzleException $e) {
            Log::error('OpenWeatherMap Geocoding API Error: ' . $e->getMessage());
            throw new \Exception('Could not geocode location: ' . $e->getMessage());
        }
    }

    /**
     * Transform raw current weather data into our format
     *
     * @param array $data
     * @return array
     */
    private function transformCurrentWeatherData(array $data): array
    {
        return [
            'temp' => $data['main']['temp'],
            'feels_like' => $data['main']['feels_like'],
            'temp_min' => $data['main']['temp_min'],
            'temp_max' => $data['main']['temp_max'],
            'humidity' => $data['main']['humidity'],
            'pressure' => $data['main']['pressure'],
            'wind_speed' => $data['wind']['speed'],
            'wind_deg' => $data['wind']['deg'] ?? null,
            'weather' => [
                'main' => $data['weather'][0]['main'],
                'description' => $data['weather'][0]['description'],
                'icon' => $data['weather'][0]['icon'],
            ],
            'clouds' => $data['clouds']['all'] ?? 0,
            'visibility' => $data['visibility'] ?? null,
            'sunrise' => $data['sys']['sunrise'] ?? null,
            'sunset' => $data['sys']['sunset'] ?? null,
            'timezone' => $data['timezone'] ?? 0,
            'location' => [
                'name' => $data['name'],
                'country' => $data['sys']['country'],
                'coord' => $data['coord'],
            ],
            'dt' => $data['dt'],
        ];
    }

    /**
     * Transform raw forecast data into our format
     *
     * @param array $data
     * @return array
     */
    private function transformForecastData(array $data): array
    {
        $forecasts = [];
        $dailyData = [];

        // Group forecasts by date
        foreach ($data['list'] as $forecast) {
            $date = date('Y-m-d', $forecast['dt']);
            if (!isset($dailyData[$date])) {
                $dailyData[$date] = [
                    'temp' => [],
                    'weather' => [],
                    'timestamps' => [],
                ];
            }

            $dailyData[$date]['temp'][] = $forecast['main']['temp'];
            $dailyData[$date]['weather'][] = $forecast['weather'][0];
            $dailyData[$date]['timestamps'][] = $forecast['dt_txt'];
        }

        // Process each day's data
        foreach ($dailyData as $date => $dayData) {
            // Get average temp for the day
            $avgTemp = array_sum($dayData['temp']) / count($dayData['temp']);

            // Find most common weather condition
            $weatherCounts = array_count_values(
                array_map(fn($w) => $w['main'], $dayData['weather'])
            );
            arsort($weatherCounts);
            $mainWeather = key($weatherCounts);

            // Find corresponding icon
            $weatherIcon = $dayData['weather'][0]['icon']; // Default to first
            foreach ($dayData['weather'] as $weather) {
                if ($weather['main'] === $mainWeather) {
                    $weatherIcon = $weather['icon'];
                    break;
                }
            }

            $forecasts[] = [
                'date' => $date,
                'day_name' => date('D', strtotime($date)),
                'temp' => round($avgTemp, 1),
                'weather' => [
                    'main' => $mainWeather,
                    'description' => ucfirst($mainWeather),
                    'icon' => $weatherIcon,
                ],
                'timestamps' => $dayData['timestamps'],
            ];

            // Limit to 3 days
            if (count($forecasts) >= 3) {
                break;
            }
        }

        return $forecasts;
    }
}
