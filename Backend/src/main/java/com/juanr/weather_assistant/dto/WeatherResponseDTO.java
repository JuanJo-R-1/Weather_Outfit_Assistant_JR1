package com.juanr.weather_assistant.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class WeatherResponseDTO {
    private String city;
    private BigDecimal temperature;
    private BigDecimal feelsLike;
    private Integer humidity;
    private String condition;
    private BigDecimal windSpeed;
    private String recommendation;
}