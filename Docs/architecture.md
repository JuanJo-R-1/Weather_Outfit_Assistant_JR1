La arquitectura del sistema estará compuesta por varios componentes que interactúan entre sí para procesar la información climática y generar recomendaciones.

### Componentes principales

**Frontend**

- Interfaz web donde el usuario ingresa la ciudad y visualiza la recomendación.

**Backend**

- API que recibe las solicitudes del usuario y coordina la comunicación con otros servicios.

**n8n**

- Plataforma de automatización que gestiona el flujo de datos entre el sistema y la API meteorológica.

**Servidor MCP**

- Expone herramientas que permiten consultar el clima y generar recomendaciones de vestimenta.

**Base de datos MySQL**

- Almacena el historial de consultas realizadas por los usuarios.

### Flujo del sistema

1. El usuario ingresa una ciudad en la interfaz web.
2. El frontend envía la solicitud al backend.
3. El backend activa un flujo en n8n.
4. n8n consulta una API meteorológica externa.
5. Se procesan los datos climáticos.
6. Se generan recomendaciones de vestimenta.
7. La información se guarda en MySQL.
8. El sistema devuelve la recomendación al usuario.


weather-outfit-assistant/
│
├──frontend/
│
│   ├──index.html
│   ├──styles.css
│   └── script.js
│
├── backend/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   │
│   └── src/
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