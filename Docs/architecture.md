La arquitectura del sistema estará compuesta por varios componentes que interactúan entre sí para procesar la información climática y generar recomendaciones.

### Componentes principales

**Frontend**

- Interfaz web donde el usuario ingresa la ciudad y visualiza la recomendación.
- Tecnologías: HTML, CSS, JavaScript
- Puerto: 8000 (servido por backend o servidor estático)

**Backend**

- API REST que recibe las solicitudes del usuario y coordina la comunicación con otros servicios.
- Tecnologías: Spring Boot (Java), JPA, MySQL
- Puerto: 3002

**MCP Server**

- Servidor que expone herramientas para consultar el clima y generar recomendaciones de vestimenta.
- Tecnologías: Node.js, Express.js
- Puerto: 4000
- Integra con OpenWeather API

**Base de datos MySQL**

- Almacena el historial de consultas realizadas por los usuarios.
- Tabla: weather_queries (id, city, temperature, condition, recommendation, timestamp)

### Flujo del sistema

1. El usuario ingresa una ciudad en la interfaz web.
2. El frontend envía una solicitud POST al backend (/api/weather-outfit).
3. El backend llama al MCP server para obtener datos del clima y recomendación.
4. El MCP server consulta la API de OpenWeather para datos reales del clima.
5. Se procesan los datos climáticos y se genera la recomendación.
6. La información se guarda en MySQL.
7. El backend devuelve la recomendación al frontend.
8. El frontend muestra la recomendación al usuario.

### Diagrama de arquitectura

```
[Frontend] <--> [Backend (Spring Boot)] <--> [MCP Server (Node.js)]
    |              |                           |
    |              |                           --> [OpenWeather API]
    |              |
    |              --> [MySQL Database]
    |
    --> [Usuario]
```

### Tecnologías utilizadas

- **Backend**: Java 17, Spring Boot 3.2.0, Spring Web, Spring Data JPA, MySQL Connector
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **MCP Server**: Node.js, Express.js, Axios
- **Base de datos**: MySQL 8.0
- **API externa**: OpenWeather API
- **Build tool**: Maven

### Configuración de puertos

- Backend: 3002
- MCP Server: 4000
- Frontend: 8000 (opcional, puede servirse desde backend)

### Seguridad

- API keys almacenadas en variables de entorno (.env)
- CORS configurado para permitir solicitudes desde frontend
- Validación de entrada en endpoints
│       ├── main/
│       │   ├── java/
│       │   │   └── com/
│       │   │       └── weatherassistant/
│       │   │
│       │   │           ├── WeatherAssistantApplication.java
│       │   │
│       │   │           ├── controller/
│       │   │           │   └── WeatherController.java
│       │   │
│       │   │           ├── service/
│       │   │           │   └── WeatherService.java
│       │   │
│       │   │           ├── repository/
│       │   │           │   └── WeatherQueryRepository.java
│       │   │
│       │   │           ├── model/
│       │   │           │   └── WeatherQuery.java
│       │   │
│       │   │           ├── dto/
│       │   │           │   ├── WeatherRequestDTO.java
│       │   │           │   └── WeatherResponseDTO.java
│       │   │
│       │   │           ├── client/
│       │   │           │   └── WeatherApiClient.java
│       │   │
│       │   │           ├── util/
│       │   │           │   └── ClothingRecommendationUtil.java
│       │   │
│       │   │           └── config/
│       │   │               ├── RestTemplateConfig.java
│       │   │               └── CorsConfig.java
│       │   │
│       │   └── resources/
│       │       ├── application.properties
│       │       ├── schema.sql
│       │       └── data.sql
│       │
│       └── test/
│           └── java/
│               └── com/
│                   └── weatherassistant/
│                       └── WeatherAssistantApplicationTests.java
│
├── mcp-server/
│   ├── src/
│   │   ├── tools/
│   │   │   ├── getWeather.js
│   │   │   └── recommendOutfit.js
│   │   └── server.js
│   └── package.json
│
├── database/
│   └── schema.sql
│
└── docs/
    ├── architecture.md
    ├── api-spec.md
    └── system-design.md