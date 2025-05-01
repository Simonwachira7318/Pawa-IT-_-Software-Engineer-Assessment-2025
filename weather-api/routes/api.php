<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeatherController;
use App\Http\Controllers\GeocodeController;

Route::middleware('api')->group(function () {
    Route::get('/weather', [WeatherController::class, 'getWeather']);
    Route::get('/geocode', [GeocodeController::class, 'geocode']);
});
