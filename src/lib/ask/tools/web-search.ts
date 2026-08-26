import { registerTool } from "./registry";
import type { Tool } from "./types";

function extractResults(html: string, maxResults: number): Array<{ title: string; snippet: string; url: string }> {
  const results: Array<{ title: string; snippet: string; url: string }> = [];

  const resultPattern = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;

  let match;
  while ((match = resultPattern.exec(html)) !== null && results.length < maxResults) {
    let url = match[1] ?? "";
    const title = match[2]?.replace(/<[^>]*>/g, "").trim() ?? "";
    const snippet = match[3]?.replace(/<[^>]*>/g, "").trim() ?? "";

    if (url.startsWith("//")) url = `https:${url}`;
    if (title && snippet && url) {
      results.push({ title, snippet, url });
    }
  }

  if (results.length === 0) {
    const linkPattern = /<a[^>]*class="result__a"[^>]*>([\s\S]*?)<\/a>/gi;
    const snippetPattern = /<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;
    const hrefPattern = /<a[^>]*class="result__a"[^>]*href="([^"]*)"/gi;

    const titles: string[] = [];
    const snippets: string[] = [];
    const hrefs: string[] = [];

    let m;
    while ((m = linkPattern.exec(html)) !== null) titles.push(m[1]?.replace(/<[^>]*>/g, "").trim() ?? "");
    while ((m = snippetPattern.exec(html)) !== null) snippets.push(m[1]?.replace(/<[^>]*>/g, "").trim() ?? "");
    while ((m = hrefPattern.exec(html)) !== null) {
      let h = m[1] ?? "";
      if (h.startsWith("//")) h = `https:${h}`;
      hrefs.push(h);
    }

    for (let i = 0; i < Math.min(titles.length, snippets.length, hrefs.length, maxResults); i++) {
      if (titles[i] && snippets[i] && hrefs[i]) {
        results.push({ title: titles[i], snippet: snippets[i], url: hrefs[i] });
      }
    }
  }

  return results;
}

const webSearchTool: Tool = {
  name: "web_search",
  description:
    "Search the web for current information, news, facts, or answers to questions that require up-to-date data. Returns titles, snippets, and URLs of relevant results.",
  parameters: {
    query: {
      type: "string",
      description: "The search query to find information about",
      required: true,
    },
    num_results: {
      type: "number",
      description: "Number of results to return (1-5, default 3)",
    },
  },
  execute: async (args) => {
    const query = typeof args.query === "string" ? args.query.trim() : "";
    if (!query) {
      return { success: false, output: "No search query provided." };
    }

    const maxResults =
      typeof args.num_results === "number"
        ? Math.min(Math.max(Math.round(args.num_results), 1), 5)
        : 3;

    try {
      const res = await fetch("https://html.duckduckgo.com/html/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (compatible; AskAnujBot/1.0)",
        },
        body: new URLSearchParams({ q: query }).toString(),
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        return { success: false, output: `Search request failed (HTTP ${res.status}).` };
      }

      const html = await res.text();
      const results = extractResults(html, maxResults);

      if (results.length === 0) {
        return {
          success: true,
          output: `No results found for "${query}". Try a different search term.`,
        };
      }

      const lines = results.map(
        (r, i) => `${i + 1}. **${r.title}**\n   ${r.snippet}\n   ${r.url}`,
      );

      return {
        success: true,
        output: `Search results for "${query}":\n\n${lines.join("\n\n")}`,
      };
    } catch {
      return {
        success: false,
        output: `Web search failed. Try rephrasing your query.`,
      };
    }
  },
};

registerTool(webSearchTool);
