import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function getWeather(city) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",   // Celsius
        lang: "es"         // Descripciones en español
      }
    });

    const data = response.data;

    return {
      city: data.name,
      temperature: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      condition: data.weather[0].description,
      wind_speed: data.wind.speed
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Ciudad "${city}" no encontrada`);
    }
    throw new Error("Error al consultar la API meteorológica");
  }
}