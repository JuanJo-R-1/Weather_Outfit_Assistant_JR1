import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getWeather } from "./tools/getWeather.js";
import { recommendOutfit } from "./tools/recommendOutfit.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ─── Tool: get_weather ───────────────────────────────────────────────────────
app.post("/tool/get_weather", async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: "El campo 'city' es requerido" });
  }

  try {
    const weatherData = await getWeather(city);
    return res.json(weatherData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── Tool: recommend_outfit ──────────────────────────────────────────────────
app.post("/tool/recommend_outfit", (req, res) => {
  const { temperature, condition, wind_speed } = req.body;

  if (temperature === undefined || temperature === null) {
    return res.status(400).json({ error: "El campo 'temperature' es requerido" });
  }

  const recommendation = recommendOutfit(temperature, condition, wind_speed);
  return res.json({ recommendation });
});

// ─── Endpoint combinado (clima + recomendación en una sola llamada) ──────────
app.post("/tool/weather_outfit", async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: "El campo 'city' es requerido" });
  }

  try {
    const weatherData = await getWeather(city);
    const recommendation = recommendOutfit(
      weatherData.temperature,
      weatherData.condition,
      weatherData.wind_speed
    );

    return res.json({
      ...weatherData,
      recommendation
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── Health check ────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", tools: ["get_weather", "recommend_outfit", "weather_outfit"] });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ MCP Server corriendo en http://localhost:${PORT}`);
});
