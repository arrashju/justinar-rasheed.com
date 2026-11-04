import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { SkipLink } from "@/components/layout";
import { site } from "@/content/site";
import { GlobalStyle } from "@/styles/GlobalStyle";
import { palette } from "@/styles/tokens";
import StyledComponentsRegistry from "./registry";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Design Engineer`, template: `%s — ${site.name}` },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Design Engineer`,
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name}, ${site.title}` }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: palette.light.bg },
    { media: "(prefers-color-scheme: dark)", color: palette.dark.bg },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <SkipLink href="#main" className="visually-hidden">
            Skip to content
          </SkipLink>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
