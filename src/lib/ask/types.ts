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
};

export type AskResponse = {
  answer: string;
  actions?: AskAction[];
  results?: AskResult[];
  source?: "ai" | "local";
};

export type Message = {
  role: "user" | "assistant";
  text: string;
  actions?: AskAction[];
  results?: AskResult[];
};
