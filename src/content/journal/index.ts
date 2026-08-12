import type { ComponentType } from "react";
import type { JournalEntryMeta } from "@/lib/types";
import * as startingEngineeringPortfolio from "./starting-engineering-portfolio.mdx";
import * as complexityAnalysisFirst from "./complexity-analysis-first.mdx";
import * as normalizationPayoff from "./normalization-payoff.mdx";

export type JournalEntryModule = JournalEntryMeta & {
  Component: ComponentType;
};

type MdxModule = {
  meta: JournalEntryMeta;
  default: ComponentType;
};

function asEntry(mdx: unknown): JournalEntryModule {
  const mod = mdx as MdxModule;
  return { ...mod.meta, Component: mod.default };
}

export const journalEntries: JournalEntryModule[] = [
  asEntry(startingEngineeringPortfolio),
  asEntry(complexityAnalysisFirst),
  asEntry(normalizationPayoff),
];
