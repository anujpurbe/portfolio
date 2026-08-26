import type { Tool, ToolResult } from "./types";

const registry = new Map<string, Tool>();

export function registerTool(tool: Tool): void {
  registry.set(tool.name, tool);
}

export function getTool(name: string): Tool | undefined {
  return registry.get(name);
}

export function getAllTools(): Tool[] {
  return Array.from(registry.values());
}

export function getToolDefinitions() {
  return getAllTools().map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: {
        type: "object",
        properties: Object.fromEntries(
          Object.entries(t.parameters).map(([key, param]) => [
            key,
            {
              type: param.type,
              description: param.description,
            },
          ]),
        ),
        required: Object.entries(t.parameters)
          .filter(([, p]) => p.required !== false)
          .map(([key]) => key),
      },
    },
  }));
}

export async function executeTool(
  name: string,
  args: Record<string, unknown>,
): Promise<ToolResult> {
  const tool = registry.get(name);
  if (!tool) {
    return { success: false, output: `Unknown tool: ${name}` };
  }
  try {
    return await tool.execute(args);
  } catch (error) {
    return {
      success: false,
      output: `Tool "${name}" failed: ${(error as Error)?.message ?? "unknown error"}`,
    };
  }
}
