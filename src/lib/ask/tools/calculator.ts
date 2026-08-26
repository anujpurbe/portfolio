import { registerTool } from "./registry";
import type { Tool } from "./types";

function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < expr.length) {
    if (expr[i] === " ") {
      i++;
      continue;
    }
    if ("0123456789.".includes(expr[i])) {
      let num = "";
      while (i < expr.length && "0123456789.".includes(expr[i])) {
        num += expr[i++];
      }
      tokens.push(num);
      continue;
    }
    if ("+-*/^()".includes(expr[i])) {
      tokens.push(expr[i++]);
      continue;
    }
    throw new Error(`Unexpected character: ${expr[i]}`);
  }
  return tokens;
}

function parseExpr(tokens: string[], pos: { i: number }): number {
  let left = parseTerm(tokens, pos);
  while (pos.i < tokens.length && (tokens[pos.i] === "+" || tokens[pos.i] === "-")) {
    const op = tokens[pos.i++];
    const right = parseTerm(tokens, pos);
    left = op === "+" ? left + right : left - right;
  }
  return left;
}

function parseTerm(tokens: string[], pos: { i: number }): number {
  let left = parsePower(tokens, pos);
  while (pos.i < tokens.length && (tokens[pos.i] === "*" || tokens[pos.i] === "/")) {
    const op = tokens[pos.i++];
    const right = parsePower(tokens, pos);
    left = op === "*" ? left * right : left / right;
  }
  return left;
}

function parsePower(tokens: string[], pos: { i: number }): number {
  let base = parseUnary(tokens, pos);
  if (pos.i < tokens.length && tokens[pos.i] === "^") {
    pos.i++;
    const exp = parsePower(tokens, pos);
    base = Math.pow(base, exp);
  }
  return base;
}

function parseUnary(tokens: string[], pos: { i: number }): number {
  if (pos.i < tokens.length && tokens[pos.i] === "-") {
    pos.i++;
    return -parsePrimary(tokens, pos);
  }
  if (pos.i < tokens.length && tokens[pos.i] === "+") {
    pos.i++;
  }
  return parsePrimary(tokens, pos);
}

function parsePrimary(tokens: string[], pos: { i: number }): number {
  if (pos.i >= tokens.length) throw new Error("Unexpected end of expression");
  const token = tokens[pos.i];

  if (token === "(") {
    pos.i++;
    const val = parseExpr(tokens, pos);
    if (pos.i >= tokens.length || tokens[pos.i] !== ")") {
      throw new Error("Missing closing parenthesis");
    }
    pos.i++;
    return val;
  }

  const num = parseFloat(token);
  if (isNaN(num)) throw new Error(`Cannot parse number: ${token}`);
  pos.i++;
  return num;
}

function evaluateMath(expr: string): number {
  const cleaned = expr.replace(/\s/g, "");
  const tokens = tokenize(cleaned);
  if (tokens.length === 0) throw new Error("Empty expression");
  const pos = { i: 0 };
  const result = parseExpr(tokens, pos);
  if (pos.i < tokens.length) {
    throw new Error(`Unexpected token: ${tokens[pos.i]}`);
  }
  return result;
}

const calculatorTool: Tool = {
  name: "calculate",
  description:
    "Evaluate a mathematical expression. Supports +, -, *, /, ^ (power), parentheses, and decimal numbers. Example: '2 * (3 + 4)' returns 14.",
  parameters: {
    expression: {
      type: "string",
      description: "The mathematical expression to evaluate",
      required: true,
    },
  },
  execute: async (args) => {
    const expr = typeof args.expression === "string" ? args.expression : "";
    if (!expr.trim()) {
      return { success: false, output: "No expression provided." };
    }
    try {
      const result = evaluateMath(expr);
      if (!Number.isFinite(result)) {
        return { success: false, output: `Result is not a finite number: ${result}` };
      }
      const rounded = Math.round(result * 1e10) / 1e10;
      return {
        success: true,
        output: `${expr} = ${rounded}`,
      };
    } catch (error) {
      return {
        success: false,
        output: `Could not evaluate "${expr}": ${(error as Error)?.message}`,
      };
    }
  },
};

registerTool(calculatorTool);
