<?php

namespace App\Http\Controllers;

use App\Services\OpenWeatherMapService;
use Illuminate\Http\Request;

class WeatherController extends Controller
{
    protected $weatherService;

    public function __construct(OpenWeatherMapService $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    public function getWeather(Request $request)
    {
        $request->validate([
            'location' => 'required|string',
            'units' => 'sometimes|in:metric,imperial'
        ]);

        try {
            $location = $request->input('location');
            $units = $request->input('units', 'metric');

            $currentWeather = $this->weatherService->getCurrentWeather($location, $units);
            $forecast = $this->weatherService->getForecast($location, $units);

            return response()->json([
                'current' => $currentWeather,
                'forecast' => $forecast
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
    }
}
