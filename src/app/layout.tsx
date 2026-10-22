import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { getSettings } from "@/lib/data";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const description = settings.seoDescription || settings.heroDescription;
  const shareImage = settings.ogImage ?? settings.heroImage;

  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: settings.seoTitle,
      template: `%s | ${settings.businessName}`,
    },
    description,
    keywords:
      settings.seoKeywords.length > 0
        ? settings.seoKeywords
        : undefined,
    applicationName: settings.businessName,
    authors: [{ name: settings.businessName }],
    creator: settings.businessName,
    formatDetection: { telephone: false },
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
    icons: settings.faviconUrl
      ? {
          icon: settings.faviconUrl,
          shortcut: settings.faviconUrl,
          apple: settings.faviconUrl,
        }
      : undefined,
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: siteUrl(),
      siteName: settings.businessName,
      title: settings.seoTitle,
      description,
      images: [
        {
          url: shareImage,
          width: 1600,
          height: 1067,
          alt: `${settings.businessName} interior design`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seoTitle,
      description,
      images: [shareImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#f7f2e9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory text-charcoal">
        {children}
      </body>
    </html>
  );
}
