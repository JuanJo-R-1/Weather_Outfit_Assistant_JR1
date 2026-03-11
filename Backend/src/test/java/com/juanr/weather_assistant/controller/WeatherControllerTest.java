package com.juanr.weather_assistant.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.juanr.weather_assistant.dto.WeatherRequestDTO;
import com.juanr.weather_assistant.dto.WeatherResponseDTO;
import com.juanr.weather_assistant.model.WeatherQuery;
import com.juanr.weather_assistant.service.WeatherService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WeatherController.class)
@DisplayName("WeatherController - Tests de integración HTTP")
class WeatherControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WeatherService weatherService;

    @Autowired
    private ObjectMapper objectMapper;

    // ── Helpers ───────────────────────────────────────────────────────────────

    private WeatherResponseDTO buildResponse(String city, double temp, String condition, String recommendation) {
        WeatherResponseDTO dto = new WeatherResponseDTO();
        dto.setCity(city);
        dto.setTemperature(new BigDecimal(String.valueOf(temp)));
        dto.setFeelsLike(new BigDecimal(String.valueOf(temp - 2)));
        dto.setHumidity(65);
        dto.setCondition(condition);
        dto.setWindSpeed(new BigDecimal("12.0"));
        dto.setRecommendation(recommendation);
        return dto;
    }

    // ── Tests POST /api/weather-outfit ────────────────────────────────────────

    @Test
    @DisplayName("POST /api/weather-outfit - debe retornar 200 con datos correctos")
    void shouldReturn200WithWeatherData() throws Exception {
        WeatherResponseDTO mockResponse = buildResponse(
                "Bogotá", 14.0, "nublado", "Usa chaqueta ligera o suéter.");

        when(weatherService.getWeatherOutfit("Bogotá")).thenReturn(mockResponse);

        WeatherRequestDTO request = new WeatherRequestDTO();
        request.setCity("Bogotá");

        mockMvc.perform(post("/api/weather-outfit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("Bogotá"))
                .andExpect(jsonPath("$.temperature").value(14.0))
                .andExpect(jsonPath("$.condition").value("nublado"))
                .andExpect(jsonPath("$.recommendation").value("Usa chaqueta ligera o suéter."))
                .andExpect(jsonPath("$.humidity").value(65));
    }

    @Test
    @DisplayName("POST /api/weather-outfit - debe retornar 400 si la ciudad es vacía")
    void shouldReturn400IfCityIsEmpty() throws Exception {
        when(weatherService.getWeatherOutfit(""))
                .thenThrow(new IllegalArgumentException("El nombre de la ciudad no puede estar vacío"));

        WeatherRequestDTO request = new WeatherRequestDTO();
        request.setCity("");

        mockMvc.perform(post("/api/weather-outfit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @DisplayName("POST /api/weather-outfit - debe retornar 500 si el MCP no responde")
    void shouldReturn500IfMcpFails() throws Exception {
        when(weatherService.getWeatherOutfit("Bogotá"))
                .thenThrow(new RuntimeException("No se obtuvo respuesta del MCP server"));

        WeatherRequestDTO request = new WeatherRequestDTO();
        request.setCity("Bogotá");

        mockMvc.perform(post("/api/weather-outfit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("No se obtuvo respuesta del MCP server"));
    }

    @Test
    @DisplayName("POST /api/weather-outfit - debe incluir recomendación de paraguas en caso de lluvia")
    void shouldIncludeUmbrellaRecommendationOnRain() throws Exception {
        WeatherResponseDTO mockResponse = buildResponse(
                "Medellín", 16.0, "lluvia ligera",
                "Usa chaqueta ligera o suéter. Lleva paraguas o impermeable.");

        when(weatherService.getWeatherOutfit("Medellín")).thenReturn(mockResponse);

        WeatherRequestDTO request = new WeatherRequestDTO();
        request.setCity("Medellín");

        mockMvc.perform(post("/api/weather-outfit")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.recommendation").value(
                        "Usa chaqueta ligera o suéter. Lleva paraguas o impermeable."));
    }

    // ── Tests GET /api/history ─────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/history - debe retornar lista de consultas")
    void shouldReturnHistoryList() throws Exception {
        WeatherQuery q1 = new WeatherQuery();
        q1.setCity("Bogotá");
        q1.setTemperature(new BigDecimal("14.0"));
        q1.setWeatherCondition("nublado");
        q1.setRecommendedClothes("Usa chaqueta ligera o suéter.");

        WeatherQuery q2 = new WeatherQuery();
        q2.setCity("Cali");
        q2.setTemperature(new BigDecimal("28.0"));
        q2.setWeatherCondition("soleado");
        q2.setRecommendedClothes("Usa ropa ligera y fresca.");

        when(weatherService.getHistory()).thenReturn(List.of(q1, q2));

        mockMvc.perform(get("/api/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].city").value("Bogotá"))
                .andExpect(jsonPath("$[1].city").value("Cali"));
    }

    @Test
    @DisplayName("GET /api/history - debe retornar lista vacía si no hay consultas")
    void shouldReturnEmptyHistoryWhenNoQueries() throws Exception {
        when(weatherService.getHistory()).thenReturn(List.of());

        mockMvc.perform(get("/api/history"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
}