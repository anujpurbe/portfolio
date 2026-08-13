export const coding = {
  leetcode: {
    url: (u: string) => `https://leetcode.com/u/${u}/`,
    profileUrl: "https://leetcode.com/u/anujpurbe/",
  },
  featuredRepos: [
    {
      name: "portfolio",
      description:
        "This site — a Next.js engineering portfolio built in public.",
      url: "https://github.com/anujpurbe/portfolio",
      language: "TypeScript",
    },
  ],
} as const;
