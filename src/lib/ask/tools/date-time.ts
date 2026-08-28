import { registerTool } from "./registry";
import type { Tool } from "./types";

const dateTimeTool: Tool = {
  name: "get_current_datetime",
  description:
    "Returns the current date, time, day of the week, and timezone. Use this when the user asks about today's date, the current time, what day it is, or similar date/time questions. Optionally accepts a timezone parameter (default: Asia/Kolkata for IST).",
  parameters: {
    timezone: {
      type: "string",
      description: "IANA timezone identifier (e.g., 'Asia/Kolkata', 'America/New_York'). Default: 'Asia/Kolkata'",
      required: false,
    },
  },
  execute: async (args) => {
    const now = new Date();
    const timezone = (args?.timezone as string) ?? "Asia/Kolkata";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
      timeZone: timezone,
    };
    const formatted = now.toLocaleString("en-IN", options);
    const iso = now.toISOString();
    return {
      success: true,
      output: `The current time is ${formatted}.`,
    };
  },
};

registerTool(dateTimeTool);
