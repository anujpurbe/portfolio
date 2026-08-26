import { registerTool } from "./registry";
import type { Tool } from "./types";

const dateTimeTool: Tool = {
  name: "get_current_datetime",
  description:
    "Returns the current date, time, day of the week, and timezone. Use this when the user asks about today's date, the current time, what day it is, or similar date/time questions.",
  parameters: {},
  execute: async () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    const formatted = now.toLocaleString("en-US", options);
    const iso = now.toISOString();
    return {
      success: true,
      output: `Current date and time: ${formatted}\nISO format: ${iso}`,
    };
  },
};

registerTool(dateTimeTool);
