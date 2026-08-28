export type AskActionType = "scroll" | "link" | "external" | "resume";

export type AskAction = {
  label: string;
  type: AskActionType;
  target?: string;
  href?: string;
};

export type AskResultType = "project" | "certificate" | "skill";

export type AskResult = {
  type: AskResultType;
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

export type AskResponse = {
  answer: string;
  actions?: AskAction[];
  results?: AskResult[];
  source?: "ai" | "local" | "tool";
  notice?: string;
};

export type AskHistoryMessage = {
  role: "user" | "assistant";
  text: string;
};

export type Message = {
  role: "user" | "assistant";
  text: string;
  actions?: AskAction[];
  results?: AskResult[];
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
