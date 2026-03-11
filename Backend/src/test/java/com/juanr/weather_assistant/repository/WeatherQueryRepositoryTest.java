package com.juanr.weather_assistant.repository;

import com.juanr.weather_assistant.model.WeatherQuery;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@DisplayName("WeatherQueryRepository - Tests de persistencia")
class WeatherQueryRepositoryTest {

    @Autowired
    private WeatherQueryRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    @DisplayName("Debe guardar y recuperar una consulta correctamente")
    void shouldSaveAndRetrieveQuery() {
        WeatherQuery query = new WeatherQuery();
        query.setCity("Bogotá");
        query.setTemperature(new BigDecimal("14.50"));
        query.setWeatherCondition("nublado");
        query.setRecommendedClothes("Usa chaqueta ligera o suéter.");

        WeatherQuery saved = repository.save(query);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getCity()).isEqualTo("Bogotá");
        assertThat(saved.getTemperature()).isEqualByComparingTo("14.50");
        assertThat(saved.getCreatedAt()).isNotNull(); // @PrePersist
    }

    @Test
    @DisplayName("Debe retornar solo las últimas 10 consultas ordenadas por fecha")
    void shouldReturnTop10QueriesOrderedByDate() {
        for (int i = 1; i <= 12; i++) {
            WeatherQuery q = new WeatherQuery();
            q.setCity("Ciudad" + i);
            q.setTemperature(new BigDecimal("20.0"));
            q.setWeatherCondition("despejado");
            q.setRecommendedClothes("Usa ropa cómoda.");
            repository.save(q);
        }

        List<WeatherQuery> top10 = repository.findTop10ByOrderByCreatedAtDesc();

        assertThat(top10).hasSize(10);
        // La más reciente debe estar primero
        assertThat(top10.get(0).getCity()).isEqualTo("Ciudad12");
    }

    @Test
    @DisplayName("Debe buscar consultas por nombre de ciudad (case-insensitive)")
    void shouldFindByCityIgnoreCase() {
        WeatherQuery q = new WeatherQuery();
        q.setCity("Medellín");
        q.setTemperature(new BigDecimal("22.0"));
        q.setWeatherCondition("soleado");
        q.setRecommendedClothes("Usa ropa cómoda de media estación.");
        repository.save(q);

        List<WeatherQuery> results = repository.findByCityIgnoreCase("medellín");
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getCity()).isEqualTo("Medellín");
    }

    @Test
    @DisplayName("Debe retornar lista vacía si no hay consultas")
    void shouldReturnEmptyListWhenNoQueries() {
        List<WeatherQuery> result = repository.findTop10ByOrderByCreatedAtDesc();
        assertThat(result).isEmpty();
    }
}