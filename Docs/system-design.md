## Reglas de recomendación sugeridas

Puedes comenzar con reglas simples:

- **Menos de 10°C** → abrigo, bufanda, pantalón largo
- **10°C a 17°C** → chaqueta o suéter
- **18°C a 25°C** → ropa cómoda
- **Más de 25°C** → ropa ligera
- **Lluvia** → paraguas o impermeable
- **Viento fuerte** → chaqueta cortavientos

## MCP Server propuesto

### Herramientas

Tu servidor MCP puede exponer dos tools:

#### 1. `get_weather`

Entrada:

```
{
  "city": "Bogotá"
}
```

Salida:

```
{
  "city": "Bogotá",
  "temperature": 14,
  "condition": "Nublado"
}
```

#### 2. `recommend_outfit`

Entrada:

```
{
  "temperature": 14,
  "condition": "Nublado"
}
```

Salida:

```
{
  "recommendation": "Usa chaqueta ligera o suéter."
}
```

------

## 

const temp = $json.temperature;
const condition = ($json.condition || "").toLowerCase();

let recommendation = "";

if (temp < 10) {
  recommendation = "Usa abrigo grueso, bufanda y pantalón largo.";
} else if (temp >= 10 && temp < 18) {
  recommendation = "Usa chaqueta ligera o suéter.";
} else if (temp >= 18 && temp < 26) {
  recommendation = "Usa ropa cómoda de media estación.";
} else {
  recommendation = "Usa ropa ligera y fresca.";
}

if (condition.includes("rain") || condition.includes("lluvia")) {
  recommendation += " Lleva paraguas o impermeable.";
}

return [{
  json: {
    city: $json.city,
    temperature: temp,
    condition: $json.condition,
    recommendation
  }
}];

### Flujo del sistema

1. El usuario ingresa una ciudad en la interfaz web.
2. El frontend envía la solicitud al backend.
3. El backend activa un flujo en n8n.
4. n8n consulta una API meteorológica externa.
5. Se procesan los datos climáticos.
6. Se generan recomendaciones de vestimenta.
7. La información se guarda en MySQL.
8. El sistema devuelve la recomendación al usuario.