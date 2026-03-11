export function recommendOutfit(temperature, condition, windSpeed = 0) {
  const cond = (condition || "").toLowerCase();
  let recommendation = "";

  // Recomendación por temperatura
  if (temperature < 10) {
    recommendation = "Usa abrigo grueso, bufanda y pantalón largo.";
  } else if (temperature < 18) {
    recommendation = "Usa chaqueta ligera o suéter.";
  } else if (temperature < 26) {
    recommendation = "Usa ropa cómoda de media estación.";
  } else {
    recommendation = "Usa ropa ligera y fresca.";
  }

  // Modificadores por condición climática
  if (
    cond.includes("lluvia") ||
    cond.includes("llovizna") ||
    cond.includes("rain") ||
    cond.includes("drizzle")
  ) {
    recommendation += " Lleva paraguas o impermeable.";
  }

  if (
    cond.includes("tormenta") ||
    cond.includes("thunderstorm")
  ) {
    recommendation += " Evita salir si es posible, hay tormenta.";
  }

  if (
    cond.includes("nieve") ||
    cond.includes("snow")
  ) {
    recommendation += " Usa botas impermeables, hay nieve.";
  }

  if (windSpeed > 30) {
    recommendation += " Lleva chaqueta cortavientos, hay viento fuerte.";
  }

  return recommendation;
}