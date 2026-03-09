**Opción recomendada**

Usar n8n como orquestador central.

**Nodos sugeridos**

**1. Webhook**

- Recibe `city`

**2. HTTP Request**

- Consulta la API meteorológica
- Ejemplo:
  - OpenWeatherMap
  - WeatherAPI

**3. Function / Code**

- Extrae:
  - temperatura
  - clima
  - sensación térmica
- Aplica reglas de recomendación

**4. MySQL**

- Inserta el registro en la base de datos

**5. Respond to Webhook**

- Devuelve JSON al frontend

## 

Para el desarrollo del proyecto se utilizará una metodología incremental que permita construir y probar cada componente del sistema de manera progresiva.

Las etapas principales del desarrollo serán:

1. **Análisis del problema**
   - Identificación de necesidades del usuario.
   - Definición de funcionalidades del sistema.
2. **Diseño del sistema**
   - Definición de la arquitectura.
   - Diseño de base de datos.
   - Definición de flujos de automatización.
3. **Implementación**
   - Desarrollo del backend.
   - Configuración de n8n.
   - Integración con API meteorológica.
   - Implementación de MCP.
   - Creación de base de datos MySQL.
4. **Pruebas**
   - Validación del flujo completo del sistema.
   - Verificación de recomendaciones generadas.
5. **Documentación**
   - Elaboración de documentación técnica del proyecto.