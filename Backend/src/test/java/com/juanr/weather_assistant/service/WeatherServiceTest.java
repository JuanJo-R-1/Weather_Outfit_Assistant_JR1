package com.juanr.weather_assistant.service;

import com.juanr.weather_assistant.dto.WeatherResponseDTO;
import com.juanr.weather_assistant.model.WeatherQuery;
import com.juanr.weather_assistant.repository.WeatherQueryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("WeatherService - Tests unitarios")
class WeatherServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private WeatherQueryRepository repository;

    @InjectMocks
    private WeatherService weatherService;

    @BeforeEach
    void setUp() {
        // Inyectar el valor de @Value manualmente
        ReflectionTestUtils.setField(weatherService, "mcpServerUrl", "http://localhost:4000");
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Map<String, Object> buildMcpResponse(String city, double temp, String condition, String recommendation) {
        Map<String, Object> response = new HashMap<>();
        response.put("city", city);
        response.put("temperature", temp);
        response.put("feels_like", temp - 2);
        response.put("humidity", 70);
        response.put("condition", condition);
        response.put("wind_speed", 10.0);
        response.put("recommendation", recommendation);
        return response;
    }

    // ── Tests principales ─────────────────────────────────────────────────────

    @Test
    @DisplayName("Debe retornar respuesta correcta cuando MCP responde bien")
    void shouldReturnCorrectResponseFromMcp() {
        Map<String, Object> mcpResponse = buildMcpResponse(
                "Bogotá", 14.0, "nublado", "Usa chaqueta ligera o suéter.");

        when(restTemplate.postForObject(
                eq("http://localhost:4000/tool/weather_outfit"),
                any(),
                eq(Map.class)
        )).thenReturn(mcpResponse);

        WeatherResponseDTO result = weatherService.getWeatherOutfit("Bogotá");

        assertThat(result.getCity()).isEqualTo("Bogotá");
        assertThat(result.getTemperature()).isEqualByComparingTo("14.0");
        assertThat(result.getCondition()).isEqualTo("nublado");
        assertThat(result.getRecommendation()).isEqualTo("Usa chaqueta ligera o suéter.");
        assertThat(result.getHumidity()).isEqualTo(70);
    }

    @Test
    @DisplayName("Debe guardar la consulta en MySQL después de obtener datos del MCP")
    void shouldSaveQueryToDatabase() {
        Map<String, Object> mcpResponse = buildMcpResponse(
                "Cali", 28.0, "soleado", "Usa ropa ligera y fresca.");

        when(restTemplate.postForObject(anyString(), any(), eq(Map.class)))
                .thenReturn(mcpResponse);

        weatherService.getWeatherOutfit("Cali");

        // Verificar que se llamó repository.save() exactamente una vez
        ArgumentCaptor<WeatherQuery> captor = ArgumentCaptor.forClass(WeatherQuery.class);
        verify(repository, times(1)).save(captor.capture());

        WeatherQuery saved = captor.getValue();
        assertThat(saved.getCity()).isEqualTo("Cali");
        assertThat(saved.getTemperature()).isEqualByComparingTo("28.0");
        assertThat(saved.getWeatherCondition()).isEqualTo("soleado");
        assertThat(saved.getRecommendedClothes()).isEqualTo("Usa ropa ligera y fresca.");
    }

    @Test
    @DisplayName("Debe lanzar IllegalArgumentException si la ciudad es nula")
    void shouldThrowIfCityIsNull() {
        assertThatThrownBy(() -> weatherService.getWeatherOutfit(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("no puede estar vacío");

        verify(restTemplate, never()).postForObject(anyString(), any(), any());
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Debe lanzar IllegalArgumentException si la ciudad es cadena vacía")
    void shouldThrowIfCityIsBlank() {
        assertThatThrownBy(() -> weatherService.getWeatherOutfit("   "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("no puede estar vacío");
    }

    @Test
    @DisplayName("Debe lanzar RuntimeException si el MCP retorna null")
    void shouldThrowIfMcpReturnsNull() {
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class)))
                .thenReturn(null);

        assertThatThrownBy(() -> weatherService.getWeatherOutfit("Bogotá"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("No se obtuvo respuesta del MCP server");
    }

    @Test
    @DisplayName("Debe propagar excepción si el MCP server no está disponible")
    void shouldPropagateExceptionIfMcpUnavailable() {
        when(restTemplate.postForObject(anyString(), any(), eq(Map.class)))
                .thenThrow(new RuntimeException("Connection refused"));

        assertThatThrownBy(() -> weatherService.getWeatherOutfit("Bogotá"))
                .isInstanceOf(RuntimeException.class);

        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Debe retornar historial de las últimas 10 consultas")
    void shouldReturnHistory() {
        List<WeatherQuery> mockHistory = List.of(new WeatherQuery(), new WeatherQuery());
        when(repository.findTop10ByOrderByCreatedAtDesc()).thenReturn(mockHistory);

        List<WeatherQuery> result = weatherService.getHistory();

        assertThat(result).hasSize(2);
        verify(repository, times(1)).findTop10ByOrderByCreatedAtDesc();
    }
}