import { Suspense } from "react";
import { Hero } from "@/components/hero/hero";
import { Stats } from "@/components/stats/stats";
import { Currently } from "@/components/currently/currently";
import { About } from "@/components/about/about";
import { Skills } from "@/components/skills/skills";
import { Projects } from "@/components/projects/projects";
import { Achievements } from "@/components/achievements/achievements";
import { Education } from "@/components/education/education";
import { AcademicJourney } from "@/components/education/academic-journey";
import { Certifications } from "@/components/certifications/certifications";
import { GithubActivity } from "@/components/github/github-activity";
import { LeetCodeSection } from "@/components/coding/leetcode-section";
import { JournalSection } from "@/components/journal/journal-section";
import { Comments } from "@/components/comments/comments";
import { Contact } from "@/components/contact/contact";
import { SectionSkeleton } from "@/components/ui/section-skeleton";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Currently />
      <About />
      <Skills />
      <Projects />
      <Achievements />
      <Education />
      <AcademicJourney />
      <Certifications />
      <Suspense fallback={<SectionSkeleton label="Loading GitHub data…" />}>
        <GithubActivity />
      </Suspense>
      <Suspense fallback={<SectionSkeleton label="Loading coding stats…" />}>
        <LeetCodeSection />
      </Suspense>
      <JournalSection />
      <Comments />
      <Contact />
    </>
  );
}
