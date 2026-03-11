package com.juanr.weather_assistant.controller;

import com.juanr.weather_assistant.dto.WeatherRequestDTO;
import com.juanr.weather_assistant.dto.WeatherResponseDTO;
import com.juanr.weather_assistant.model.WeatherQuery;
import com.juanr.weather_assistant.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    // Endpoint principal - consultado por el frontend
    @PostMapping("/weather-outfit")
    public ResponseEntity<?> getWeatherOutfit(@RequestBody WeatherRequestDTO request) {
        try {
            WeatherResponseDTO response = weatherService.getWeatherOutfit(request.getCity());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint para ver el historial de consultas
    @GetMapping("/history")
    public ResponseEntity<List<WeatherQuery>> getHistory() {
        return ResponseEntity.ok(weatherService.getHistory());
    }
}