const API_URL = "http://localhost:3002/api/weather-outfit";

function getWeatherIcon(condition) {
  const normalized = (condition || "").toLowerCase();

  if (normalized.includes("rain") || normalized.includes("lluvia") || normalized.includes("storm")) {
    return "🌧️";
  }
  if (normalized.includes("cloud")) {
    return "☁️";
  }
  if (normalized.includes("sun") || normalized.includes("clear")) {
    return "☀️";
  }
  if (normalized.includes("snow") || normalized.includes("nieve")) {
    return "❄️";
  }
  if (normalized.includes("wind") || normalized.includes("viento")) {
    return "🌬️";
  }
  return "🌤️";
}

function formatUpdatedTime() {
  const now = new Date();
  return `Actualizado: ${now.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  })}`;
}

function applyTemperatureTheme(tempCelsius) {
  const MIDPOINT = 18;
  const body = document.body;
  body.classList.remove("theme--cold", "theme--warm");

  if (typeof tempCelsius !== "number" || Number.isNaN(tempCelsius)) {
    return;
  }

  if (tempCelsius < MIDPOINT) {
    body.classList.add("theme--cold");
  } else {
    body.classList.add("theme--warm");
  }
}

function showStatus(message) {
  const statusEl = document.getElementById("status");
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.classList.add("show");

  clearTimeout(showStatus.timeout);
  showStatus.timeout = setTimeout(() => {
    statusEl.classList.remove("show");
  }, 4200);
}

async function consultWeather() {
  const cityInput = document.getElementById("cityInput");
  const city = cityInput.value.trim();

  const errorEl = document.getElementById("error");
  errorEl.classList.add("hidden");
  errorEl.textContent = "";

  if (!city) {
    errorEl.textContent = "Por favor ingresa una ciudad.";
    errorEl.classList.remove("hidden");
    cityInput.focus();
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message || "Error al consultar el clima");
    }

    const data = await response.json();

    const temp = Number(data.temperature);
    applyTemperatureTheme(temp);

    document.getElementById("city").textContent = data.city;
    document.getElementById("updated").textContent = formatUpdatedTime();
    document.getElementById("weatherIcon").textContent = getWeatherIcon(data.condition);

    document.getElementById("temperature").textContent = `${Math.round(temp)}°C`;
    document.getElementById("condition").textContent = data.condition;
    document.getElementById("recommendation").textContent = data.recommendation;

    document.getElementById("result").classList.remove("hidden");

    const midpoint = 18;
    const trend = temp < midpoint ? "frío" : "caluroso";
    showStatus(`Está algo ${trend} por ahí. ¡Preparate para el clima!`);
  } catch (error) {
    console.error(error);
    errorEl.textContent = error.message || "Error al consultar el clima.";
    errorEl.classList.remove("hidden");
  }
}
