# Weather Outfit Assistant

A full-stack application that provides weather-based outfit recommendations. The system integrates with OpenWeather API to fetch real-time weather data and generates personalized clothing suggestions.

## Architecture

- **Frontend**: HTML/CSS/JavaScript web interface
- **Backend**: Spring Boot REST API (Java)
- **MCP Server**: Node.js server with weather tools
- **Database**: MySQL for storing query history

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Weather_Outfit_Assistant_JR1
   ```

2. **Set up MySQL database**
   ```sql
   CREATE DATABASE weather_assistant;
   ```
   Run the schema script:
   ```bash
   mysql -u root -p weather_assistant < Database/schema.sql
   ```

3. **Configure environment variables**
   
   Create `.env` file in `mcp-server/` directory:
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```
   
   Get your API key from [OpenWeather](https://openweathermap.org/api)

4. **Install dependencies**

   Backend (Spring Boot):
   ```bash
   cd Backend
   ./mvnw clean install
   ```

   MCP Server:
   ```bash
   cd ../mcp-server
   npm install
   ```

## Running the Application

1. **Start MySQL server** (if not running)

2. **Start MCP Server** (port 4000):
   ```bash
   cd mcp-server
   npm start
   ```

3. **Start Backend** (port 3002):
   ```bash
   cd ../Backend
   ./mvnw spring-boot:run
   ```

4. **Serve Frontend** (port 8000):
   You can serve the frontend files using any static server, or from the backend by accessing:
   ```
   http://localhost:3002
   ```

## API Endpoints

- `POST /api/weather-outfit` - Get weather and outfit recommendation
- `GET /api/history` - Retrieve query history

## Testing

Run backend tests:
```bash
cd Backend
./mvnw test
```

Run MCP server tests:
```bash
cd mcp-server
npm test
```

## Configuration

### Backend Configuration (`Backend/src/main/resources/application.properties`)
- Database connection settings
- MCP server URL
- CORS origins
- JPA settings

### MCP Server Configuration (`mcp-server/.env`)
- OpenWeather API key

## Troubleshooting

- **Port conflicts**: Ensure ports 3002, 4000, and 8000 are available
- **Database connection**: Verify MySQL is running and credentials are correct
- **API key**: Ensure OpenWeather API key is valid and has sufficient quota
- **Java version**: Confirm Java 17+ is installed and JAVA_HOME is set

## Project Structure

```
Weather_Outfit_Assistant_JR1/
├── Backend/                 # Spring Boot application
├── Database/               # MySQL schema
├── Docs/                   # Documentation
├── Frontend/               # Static web files
└── mcp-server/             # Node.js MCP server
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.