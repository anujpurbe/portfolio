export type AssistantActionType = "scroll" | "link" | "external" | "resume";

export type AssistantAction = {
  label: string;
  type: AssistantActionType;
  target?: string;
  href?: string;
};

export type AssistantResultType = "project" | "certificate" | "skill";

export type AssistantResult = {
  type: AssistantResultType;
  id: string;
  title: string;
  description?: string;
  meta?: string;
  href?: string;
  download?: string;
  technologies?: string[];
  github?: string;
  demo?: string;
};

export type AssistantResponse = {
  answer: string;
  actions?: AssistantAction[];
  results?: AssistantResult[];
  source?: "ai" | "local" | "tool";
  notice?: string;
};

export type AssistantHistoryMessage = {
  role: "user" | "assistant";
  text: string;
};

// Shape used by the chat UI. Kept distinct from AssistantResponse so the
// wire format can evolve without touching the component.
export type Message = {
  role: "user" | "assistant";
  text: string;
  actions?: AssistantAction[];
  results?: AssistantResult[];
  notice?: string;
};

export type GeminiToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};