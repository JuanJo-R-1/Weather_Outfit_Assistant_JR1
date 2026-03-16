## Weather Outfit Assistant - System Design

### Arquitectura General
El sistema sigue una arquitectura de microservicios con separación clara de responsabilidades:

- **Frontend**: Interfaz de usuario simple y responsiva
- **Backend**: API REST que orquesta las operaciones
- **MCP Server**: Servicio especializado en consultas climáticas y recomendaciones
- **Base de datos**: Almacenamiento persistente de historial

### Flujo de Datos

1. **Entrada del usuario**: Ciudad (string)
2. **Validación**: Backend valida el formato de la ciudad
3. **Consulta climática**: MCP Server → OpenWeather API
4. **Procesamiento**: Aplicación de reglas de recomendación
5. **Almacenamiento**: Guardado en base de datos
6. **Respuesta**: JSON con clima y recomendación

### Reglas de recomendación

Puedes comenzar con reglas simples basadas en temperatura y condiciones:

- **Menos de 10°C** → abrigo, bufanda, pantalón largo
- **10°C a 17°C** → chaqueta o suéter
- **18°C a 25°C** → ropa cómoda
- **Más de 25°C** → ropa ligera
- **Lluvia** → paraguas o impermeable
- **Viento fuerte** → chaqueta cortavientos

### Lógica de Recomendación

La recomendación se genera combinando:
- Temperatura actual
- Condición climática (soleado, nublado, lluvia, etc.)
- Reglas predefinidas
- Mensajes descriptivos en español

### MCP Server Design

#### Herramientas expuestas

##### 1. `get_weather`
**Propósito**: Obtener datos climáticos actuales de una ciudad

**Entrada:**
```json
{
  "city": "Bogotá"
}
```

**Salida:**
```json
{
  "city": "Bogotá",
  "temperature": 14,
  "condition": "Nublado"
}
```

**Implementación**:
- Llama a OpenWeather API
- Parsea respuesta JSON
- Extrae temperatura y condición
- Maneja errores de API

##### 2. `recommend_outfit`
**Propósito**: Generar recomendación de vestimenta basada en clima

**Entrada:**
```json
{
  "temperature": 14,
  "condition": "Nublado"
}
```

**Salida:**
```json
{
  "recommendation": "Usa una chaqueta ligera y pantalones cómodos"
}
```

**Implementación**:
- Aplica reglas de negocio
- Combina temperatura y condición
- Retorna mensaje descriptivo

### Base de Datos Design

#### Tabla: weather_queries
```sql
CREATE TABLE weather_queries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(255) NOT NULL,
    temperature DOUBLE NOT NULL,
    condition VARCHAR(255) NOT NULL,
    recommendation TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Consideraciones
- ID como BIGINT para compatibilidad con JPA
- Campos NOT NULL para integridad
- Timestamp automático para auditoría

### Manejo de Errores

- **Ciudad inválida**: 400 Bad Request
- **Error de API externa**: 500 Internal Server Error con mensaje descriptivo
- **Error de base de datos**: 500 Internal Server Error
- **Timeout de API**: Reintento automático o mensaje de error

### Escalabilidad

- **Backend**: Stateless, puede escalar horizontalmente
- **MCP Server**: Puede cachear resultados para reducir llamadas a API externa
- **Base de datos**: MySQL con índices apropiados
- **Rate limiting**: Implementar límites en el backend

### Seguridad

- API keys en variables de entorno
- Validación de entrada
- CORS configurado para frontend
- Logs de auditoría (sin datos sensibles)

### Testing Strategy

- **Unit tests**: Para lógica de recomendación y validaciones
- **Integration tests**: Para llamadas a MCP server
- **End-to-end tests**: Flujo completo desde frontend
- **API tests**: Para endpoints REST