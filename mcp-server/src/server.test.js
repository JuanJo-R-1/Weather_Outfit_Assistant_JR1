/**
 * Tests de integración del MCP Server
 * Usa supertest para hacer llamadas HTTP reales al servidor Express.
 * getWeather.js es mockeado para no depender de la API real.
 */

import request from "supertest";
import express from "express";
import cors from "cors";
import { jest } from "@jest/globals";

// ── Mock de getWeather (evita llamadas reales a OpenWeatherMap) ───────────────
const mockGetWeather = jest.fn();

jest.unstable_mockModule("../src/tools/getWeather.js", () => ({
  getWeather: mockGetWeather,
}));

// ── Importar recommendOutfit real (sin mock) ─────────────────────────────────
const { recommendOutfit } = await import("../src/tools/recommendOutfit.js");

// ── Construir la app Express para tests (misma lógica que server.js) ─────────
const app = express();
app.use(express.json());
app.use(cors());

app.post("/tool/get_weather", async (req, res) => {
  const { city } = req.body;
  if (!city) return res.status(400).json({ error: "El campo 'city' es requerido" });
  try {
    const data = await mockGetWeather(city);
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.post("/tool/recommend_outfit", (req, res) => {
  const { temperature, condition, wind_speed } = req.body;
  if (temperature === undefined || temperature === null) {
    return res.status(400).json({ error: "El campo 'temperature' es requerido" });
  }
  const recommendation = recommendOutfit(temperature, condition, wind_speed);
  return res.json({ recommendation });
});

app.post("/tool/weather_outfit", async (req, res) => {
  const { city } = req.body;
  if (!city) return res.status(400).json({ error: "El campo 'city' es requerido" });
  try {
    const weatherData = await mockGetWeather(city);
    const recommendation = recommendOutfit(weatherData.temperature, weatherData.condition, weatherData.wind_speed);
    return res.json({ ...weatherData, recommendation });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.get("/health", (_, res) => {
  res.json({ status: "ok", tools: ["get_weather", "recommend_outfit", "weather_outfit"] });
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("MCP Server - Tests de integración", () => {

  beforeEach(() => {
    mockGetWeather.mockReset();
  });

  // ── GET /health ─────────────────────────────────────────────────────────────
  describe("GET /health", () => {
    test("debe retornar status ok y lista de tools", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.tools).toContain("get_weather");
      expect(res.body.tools).toContain("recommend_outfit");
      expect(res.body.tools).toContain("weather_outfit");
    });
  });

  // ── POST /tool/get_weather ──────────────────────────────────────────────────
  describe("POST /tool/get_weather", () => {
    test("debe retornar datos meteorológicos para una ciudad válida", async () => {
      mockGetWeather.mockResolvedValue({
        city: "Bogotá",
        temperature: 14,
        feels_like: 12,
        humidity: 75,
        condition: "nublado",
        wind_speed: 8,
      });

      const res = await request(app)
        .post("/tool/get_weather")
        .send({ city: "Bogotá" });

      expect(res.status).toBe(200);
      expect(res.body.city).toBe("Bogotá");
      expect(res.body.temperature).toBe(14);
      expect(res.body.condition).toBe("nublado");
    });

    test("debe retornar 400 si no se envía ciudad", async () => {
      const res = await request(app)
        .post("/tool/get_weather")
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    test("debe retornar 500 si la ciudad no existe", async () => {
      mockGetWeather.mockRejectedValue(new Error('Ciudad "XyzAbc123" no encontrada'));

      const res = await request(app)
        .post("/tool/get_weather")
        .send({ city: "XyzAbc123" });

      expect(res.status).toBe(500);
      expect(res.body.error).toContain("no encontrada");
    });
  });

  // ── POST /tool/recommend_outfit ────────────────────────────────────────────
  describe("POST /tool/recommend_outfit", () => {
    test("debe retornar recomendación para temperatura 14°C con lluvia", async () => {
      const res = await request(app)
        .post("/tool/recommend_outfit")
        .send({ temperature: 14, condition: "lluvia moderada" });

      expect(res.status).toBe(200);
      expect(res.body.recommendation).toContain("chaqueta");
      expect(res.body.recommendation).toContain("paraguas");
    });

    test("debe retornar ropa ligera para temperatura 32°C", async () => {
      const res = await request(app)
        .post("/tool/recommend_outfit")
        .send({ temperature: 32, condition: "soleado" });

      expect(res.status).toBe(200);
      expect(res.body.recommendation).toContain("ropa ligera");
    });

    test("debe retornar 400 si no se envía temperature", async () => {
      const res = await request(app)
        .post("/tool/recommend_outfit")
        .send({ condition: "soleado" });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  // ── POST /tool/weather_outfit ──────────────────────────────────────────────
  describe("POST /tool/weather_outfit", () => {
    test("debe retornar respuesta combinada con clima y recomendación", async () => {
      mockGetWeather.mockResolvedValue({
        city: "Cali",
        temperature: 28,
        feels_like: 30,
        humidity: 60,
        condition: "soleado",
        wind_speed: 5,
      });

      const res = await request(app)
        .post("/tool/weather_outfit")
        .send({ city: "Cali" });

      expect(res.status).toBe(200);
      expect(res.body.city).toBe("Cali");
      expect(res.body.temperature).toBe(28);
      expect(res.body.condition).toBe("soleado");
      expect(res.body.recommendation).toContain("ropa ligera");
    });

    test("debe incluir paraguas cuando hay lluvia", async () => {
      mockGetWeather.mockResolvedValue({
        city: "Medellín",
        temperature: 16,
        feels_like: 14,
        humidity: 85,
        condition: "lluvia ligera",
        wind_speed: 10,
      });

      const res = await request(app)
        .post("/tool/weather_outfit")
        .send({ city: "Medellín" });

      expect(res.status).toBe(200);
      expect(res.body.recommendation).toContain("paraguas");
    });

    test("debe retornar 400 si no se envía ciudad", async () => {
      const res = await request(app)
        .post("/tool/weather_outfit")
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    test("debe retornar 500 si getWeather falla", async () => {
      mockGetWeather.mockRejectedValue(new Error("Error al consultar la API meteorológica"));

      const res = await request(app)
        .post("/tool/weather_outfit")
        .send({ city: "CiudadError" });

      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });
});