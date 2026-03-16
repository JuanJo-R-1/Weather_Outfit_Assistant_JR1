# Weather Outfit Assistant API Specification

## Overview
The Weather Outfit Assistant API provides endpoints for getting weather-based outfit recommendations and retrieving query history. The API integrates with an MCP server that fetches real-time weather data from OpenWeather API.

## Base URL
```
http://localhost:3002
```

## Endpoints

### POST /api/weather-outfit
Get weather information and outfit recommendation for a specified city.

**Request Body:**
```json
{
  "city": "string"
}
```

**Response (200 OK):**
```json
{
  "city": "string",
  "temperature": number,
  "condition": "string",
  "recommendation": "string"
}
```

**Error Responses:**
- 400 Bad Request: Invalid city name
- 500 Internal Server Error: MCP server or external API error

**Example Request:**
```bash
curl -X POST http://localhost:3002/api/weather-outfit \
  -H "Content-Type: application/json" \
  -d '{"city": "London"}'
```

**Example Response:**
```json
{
  "city": "London",
  "temperature": 15,
  "condition": "Cloudy",
  "recommendation": "Wear a light jacket and comfortable pants"
}
```

### GET /api/history
Retrieve the history of weather queries.

**Response (200 OK):**
```json
[
  {
    "id": number,
    "city": "string",
    "temperature": number,
    "condition": "string",
    "recommendation": "string",
    "timestamp": "string (ISO 8601)"
  }
]
```

**Example Request:**
```bash
curl http://localhost:3002/api/history
```

**Example Response:**
```json
[
  {
    "id": 1,
    "city": "London",
    "temperature": 15,
    "condition": "Cloudy",
    "recommendation": "Wear a light jacket and comfortable pants",
    "timestamp": "2023-10-01T12:00:00Z"
  }
]
```

## MCP Server Integration
The backend communicates with an MCP server running on port 4000, which exposes tools for weather data retrieval and outfit recommendations.

### MCP Tools
- `get_weather`: Fetches current weather for a city
- `recommend_outfit`: Generates outfit recommendation based on temperature and conditions