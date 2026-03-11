package com.juanr.weather_assistant.repository;
import com.juanr.weather_assistant.model.WeatherQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WeatherQueryRepository extends JpaRepository<WeatherQuery, Long> {
    List<WeatherQuery> findTop10ByOrderByCreatedAtDesc();
    List<WeatherQuery> findByCityIgnoreCase(String city);
}