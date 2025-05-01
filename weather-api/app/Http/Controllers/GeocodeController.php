<?php

namespace App\Http\Controllers;

use App\Services\OpenWeatherMapService;
use Illuminate\Http\Request;

class GeocodeController extends Controller
{
    protected $weatherService;

    public function __construct(OpenWeatherMapService $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    public function geocode(Request $request)
    {
        $request->validate([
            'query' => 'required|string'
        ]);

        try {
            $locations = $this->weatherService->geocode($request->input('query'));
            return response()->json($locations);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
    }
}
