export type ToolParameter = {
  type: "string" | "number" | "boolean";
  description: string;
  required?: boolean;
};

export type ToolDefinition = {
  name: string;
  description: string;
  parameters: Record<string, ToolParameter>;
};

export type ToolResult = {
  success: boolean;
  output: string;
};

export type Tool = ToolDefinition & {
  execute: (args: Record<string, unknown>) => Promise<ToolResult>;
};

export type GeminiToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};
