import type { Metadata, Viewport } from "next";
import dynamicImport from "next/dynamic";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/data/site";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import "./globals.css";

const Cursor = dynamicImport(() =>
  import("@/components/cursor/cursor").then((m) => m.Cursor),
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteDescription =
  "The personal CSE portfolio of Anuj Purbe — a computer engineering undergraduate at Amrita Vishwa Vidyapeetham building efficient, well-structured software with a focus on data structures, algorithms, and databases. Open to software engineering internships.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | CSE Portfolio`,
    template: `%s — ${site.name}`,
  },
  alternates: {
    canonical: "/",
  },
  description: siteDescription,
  keywords: [
    "Anuj Purbe",
    "Computer Engineering",
    "Software Engineer",
    "Data Structures",
    "Algorithms",
    "Java",
    "MySQL",
    "Backend",
  ],
  authors: [{ name: site.fullName, url: site.url }],
  creator: site.fullName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} | CSE Portfolio`,
    description: siteDescription,
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: site.name },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | CSE Portfolio`,
    description: siteDescription,
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090f" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-foreground"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <Cursor />
        </ThemeProvider>
      </body>
    </html>
  );
}
