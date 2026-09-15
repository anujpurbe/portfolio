import type { Metadata, Viewport } from "next";
import dynamicImport from "next/dynamic";
import { Geist, Geist_Mono } from "next/font/google";
import { seo } from "@/lib/seo";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { PersonJsonLd } from "@/components/seo/person-json-ld";
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

export const metadata: Metadata = {
  metadataBase: new URL(`${seo.siteUrl}/`),
  title: {
    default: seo.title,
    template: seo.titleTemplate,
  },
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: seo.fullName, url: seo.siteUrl }],
  creator: seo.fullName,
  ...(seo.googleSiteVerification
    ? {
        verification: {
          google: seo.googleSiteVerification,
        },
      }
    : {}),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${seo.siteUrl}/`,
    siteName: seo.siteName,
    title: seo.title,
    description: seo.description,
    images: [
      {
        url: seo.openGraphImage,
        width: seo.openGraphImageWidth,
        height: seo.openGraphImageHeight,
        alt: seo.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: [seo.openGraphImage],
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
        <PersonJsonLd />
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
