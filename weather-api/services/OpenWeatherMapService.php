<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

class OpenWeatherMapService
{
    protected $client;
    protected $apiKey;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'https://api.openweathermap.org',
            'timeout' => 5.0,
        ]);
        $this->apiKey = env('OPENWEATHERMAP_API_KEY');
    }

    public function getCurrentWeather(string $location, string $units = 'metric'): array
    {
        try {
            $response = $this->client->get('/data/2.5/weather', [
                'query' => [
                    'q' => $location,
                    'appid' => $this->apiKey,
                    'units' => $units
                ]
            ]);

            $data = json_decode($response->getBody(), true);

            return [
                'temp' => $data['main']['temp'],
                'description' => $data['weather'][0]['description'],
                'icon' => $data['weather'][0]['icon'],
                'date' => date('l, F j, Y', $data['dt']),
                'location' => $data['name'] . ', ' . $data['sys']['country'],
                'wind' => round($data['wind']['speed'] * 3.6), // Convert m/s to km/h
                'humidity' => $data['main']['humidity']
            ];

        } catch (GuzzleException $e) {
            throw new \Exception('Failed to fetch current weather: ' . $e->getMessage());
        }
    }

    public function getForecast(string $location, string $units = 'metric'): array
    {
        try {
            $response = $this->client->get('/data/2.5/forecast', [
                'query' => [
                    'q' => $location,
                    'appid' => $this->apiKey,
                    'units' => $units,
                    'cnt' => 4 // Get forecast for next 3 days
                ]
            ]);

            $data = json_decode($response->getBody(), true);
            $forecast = [];

            // Skip first item (current day) and get next 3 days
            for ($i = 1; $i <= 3; $i++) {
                $item = $data['list'][$i];
                $forecast[] = [
                    'day' => date('D', $item['dt']),
                    'temp' => $item['main']['temp'],
                    'icon' => $item['weather'][0]['icon']
                ];
            }

            return $forecast;

        } catch (GuzzleException $e) {
            throw new \Exception('Failed to fetch forecast: ' . $e->getMessage());
        }
    }

    public function geocode(string $query): array
    {
        try {
            $response = $this->client->get('/geo/1.0/direct', [
                'query' => [
                    'q' => $query,
                    'limit' => 5,
                    'appid' => $this->apiKey
                ]
            ]);

            $locations = json_decode($response->getBody(), true);

            return array_map(function ($location) {
                return [
                    'name' => $location['name'],
                    'country' => $location['country'],
                    'state' => $location['state'] ?? null,
                    'lat' => $location['lat'],
                    'lon' => $location['lon']
                ];
            }, $locations);

        } catch (GuzzleException $e) {
            throw new \Exception('Failed to geocode location: ' . $e->getMessage());
        }
    }
}
