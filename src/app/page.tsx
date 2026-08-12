import { Hero } from "@/components/hero/hero";
import { Currently } from "@/components/currently/currently";
import { About } from "@/components/about/about";
import { Skills } from "@/components/skills/skills";
import { Projects } from "@/components/projects/projects";
import { Achievements } from "@/components/achievements/achievements";
import { Education } from "@/components/education/education";
import { Certifications } from "@/components/certifications/certifications";
import { GithubActivity } from "@/components/github/github-activity";
import { JournalSection } from "@/components/journal/journal-section";
import { Contact } from "@/components/contact/contact";

const contactConfigured = Boolean(
  process.env.EMAILJS_SERVICE_ID &&
    process.env.EMAILJS_TEMPLATE_ID &&
    process.env.EMAILJS_PUBLIC_KEY,
);

export default function Home() {
  return (
    <>
      <Hero />
      <Currently />
      <About />
      <Skills />
      <Projects />
      <Achievements />
      <Education />
      <Certifications />
      <GithubActivity />
      <JournalSection />
      <Contact configured={contactConfigured} />
    </>
  );
}
