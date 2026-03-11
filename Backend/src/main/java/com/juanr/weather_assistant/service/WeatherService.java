package com.juanr.weather_assistant.service;

import com.juanr.weather_assistant.dto.WeatherResponseDTO;
import com.juanr.weather_assistant.model.WeatherQuery;
import com.juanr.weather_assistant.repository.WeatherQueryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WeatherService {

    private final RestTemplate restTemplate;
    private final WeatherQueryRepository repository;

    @Value("${mcp.server.url}")
    private String mcpServerUrl;

    public WeatherService(RestTemplate restTemplate, WeatherQueryRepository repository) {
        this.restTemplate = restTemplate;
        this.repository = repository;
    }

    public WeatherResponseDTO getWeatherOutfit(String city) {
        // Validación de entrada
        if (city == null || city.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la ciudad no puede estar vacío");
        }

        // 1. Llamar al endpoint combinado del MCP server
        String url = mcpServerUrl + "/tool/weather_outfit";

        Map<String, String> request = new HashMap<>();
        request.put("city", city);

        @SuppressWarnings("unchecked")
        Map<String, Object> mcpResponse = restTemplate.postForObject(url, request, Map.class);

        if (mcpResponse == null) {
            throw new RuntimeException("No se obtuvo respuesta del MCP server");
        }

        // 2. Mapear respuesta
        WeatherResponseDTO dto = new WeatherResponseDTO();
        dto.setCity((String) mcpResponse.get("city"));
        dto.setCondition((String) mcpResponse.get("condition"));
        dto.setRecommendation((String) mcpResponse.get("recommendation"));

        Object temp = mcpResponse.get("temperature");
        dto.setTemperature(temp != null ? new BigDecimal(temp.toString()) : null);

        Object feelsLike = mcpResponse.get("feels_like");
        dto.setFeelsLike(feelsLike != null ? new BigDecimal(feelsLike.toString()) : null);

        Object humidity = mcpResponse.get("humidity");
        dto.setHumidity(humidity != null ? Integer.parseInt(humidity.toString()) : null);

        Object windSpeed = mcpResponse.get("wind_speed");
        dto.setWindSpeed(windSpeed != null ? new BigDecimal(windSpeed.toString()) : null);

        // 3. Guardar en MySQL
        WeatherQuery query = new WeatherQuery();
        query.setCity(dto.getCity());
        query.setTemperature(dto.getTemperature());
        query.setWeatherCondition(dto.getCondition());
        query.setRecommendedClothes(dto.getRecommendation());
        repository.save(query);

        return dto;
    }

    public List<WeatherQuery> getHistory() {
        return repository.findTop10ByOrderByCreatedAtDesc();
    }
}