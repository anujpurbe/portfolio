import { registerTool } from "./registry";
import type { Tool } from "./types";

const WMO_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snowfall",
  73: "Moderate snowfall",
  75: "Heavy snowfall",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

const DEFAULT_LOCATION = {
  latitude: 10.9,
  longitude: 76.9,
  name: "Coimbatore, India",
};

const weatherTool: Tool = {
  name: "get_weather",
  description:
    "Get the current weather for a location. Returns temperature, conditions, wind speed, and humidity. Defaults to Coimbatore, India if no location specified.",
  parameters: {
    location_name: {
      type: "string",
      description:
        "Name of the city or location (e.g., 'London', 'New York', 'Tokyo'). Used for display; coordinates are geocoded.",
      required: false,
    },
  },
  execute: async (args) => {
    const locationName =
      typeof args.location_name === "string" && args.location_name.trim()
        ? args.location_name.trim()
        : DEFAULT_LOCATION.name;

    let latitude = DEFAULT_LOCATION.latitude;
    let longitude = DEFAULT_LOCATION.longitude;

    if (locationName !== DEFAULT_LOCATION.name) {
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=1&language=en`,
          { signal: AbortSignal.timeout(8000) },
        );
        const geoData = (await geoRes.json()) as {
          results?: Array<{ latitude: number; longitude: number; name: string }>;
        };
        if (geoData.results && geoData.results.length > 0) {
          latitude = geoData.results[0].latitude;
          longitude = geoData.results[0].longitude;
        }
      } catch {
        return {
          success: false,
          output: `Could not geocode location "${locationName}".`,
        };
      }
    }

    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`,
        { signal: AbortSignal.timeout(8000) },
      );
      const weatherData = (await weatherRes.json()) as {
        current?: {
          temperature_2m?: number;
          relative_humidity_2m?: number;
          weather_code?: number;
          wind_speed_10m?: number;
          time?: string;
        };
      };

      const current = weatherData.current;
      if (!current) {
        return { success: false, output: "No weather data available." };
      }

      const temp = current.temperature_2m;
      const humidity = current.relative_humidity_2m;
      const code = current.weather_code;
      const wind = current.wind_speed_10m;
      const condition = code !== undefined ? WMO_CODES[code] ?? `Code ${code}` : "Unknown";

      const parts = [`Weather in ${locationName}:`];
      if (temp !== undefined) parts.push(`Temperature: ${temp}°C`);
      parts.push(`Conditions: ${condition}`);
      if (humidity !== undefined) parts.push(`Humidity: ${humidity}%`);
      if (wind !== undefined) parts.push(`Wind: ${wind} km/h`);

      return { success: true, output: parts.join("\n") };
    } catch {
      return { success: false, output: "Could not fetch weather data." };
    }
  },
};

registerTool(weatherTool);
