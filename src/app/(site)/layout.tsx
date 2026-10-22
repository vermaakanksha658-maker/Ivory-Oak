import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getFooterPages,
  getLocationPages,
  getServices,
  getSettings,
} from "@/lib/data";
import { siteJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, footerPages, locations, services] = await Promise.all([
    getSettings(),
    getFooterPages(),
    getLocationPages(),
    getServices(),
  ]);

  return (
    <>
      <JsonLd data={siteJsonLd(settings)} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-charcoal focus:px-4 focus:py-3 focus:text-[0.6875rem] focus:font-semibold focus:uppercase focus:tracking-[0.14em] focus:text-ivory"
      >
        Skip to content
      </a>
      <SiteHeader
        phone={settings.phone}
        whatsapp={settings.whatsapp}
        serviceAreas={settings.serviceAreas}
        instagram={settings.instagram}
        logoImage={settings.logoImage}
        businessName={settings.businessName}
        announcementEnabled={settings.announcementEnabled}
        announcementText={settings.announcementText}
        announcementHref={settings.announcementHref}
      />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter
        settings={settings}
        pages={footerPages}
        locations={locations}
        services={services}
      />
      <FloatingWhatsApp
        whatsapp={settings.whatsapp}
        phone={settings.phone}
        businessName={settings.businessName}
      />
      <GoogleAnalytics />
    </>
  );
}
