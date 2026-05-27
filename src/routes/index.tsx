import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { BeyondCars } from "@/components/site/BeyondCars";

import { Gallery } from "@/components/site/Gallery";
import { Process } from "@/components/site/Process";
import { Setup } from "@/components/site/Setup";
import { OnSite } from "@/components/site/OnSite";
import { Why } from "@/components/site/Why";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Reviews } from "@/components/site/Reviews";
import { Faq } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { InstagramSection } from "@/components/site/InstagramSection";
import { StickyBookCTA, InlineBookCTA } from "@/components/site/BookCTA";

const LD_JSON = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "AutoDetailing",
  name: "CarCare Mobile",
  description:
    "Mobile interior car detailing in the Helsinki capital region. Steam cleaning, deep extraction and full interior resets at your address.",
  url: "https://carcaremobilefi.com",
  telephone: "+358452599159",
  email: "info@carcaremobilefi.com",
  priceRange: "€€",
  image: "https://carcaremobilefi.com/og.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Helsinki",
    addressCountry: "FI",
  },
  areaServed: ["Helsinki", "Espoo", "Vantaa", "Kauniainen"],
  geo: { "@type": "GeoCoordinates", latitude: 60.1699, longitude: 24.9384 },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], opens: "09:00", closes: "21:00" },
  ],
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "412" },
  sameAs: ["https://instagram.com/carcaremobilefi"],
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CarCare Mobile — Mobile Interior Detailing in Helsinki" },
      {
        name: "description",
        content:
          "Premium mobile car interior detailing in Helsinki. Steam cleaning, deep extraction and full interior resets — we come to your door. Book online in 60 seconds.",
      },
      { property: "og:title", content: "CarCare Mobile — Mobile Interior Detailing in Helsinki" },
      {
        property: "og:description",
        content: "Studio-grade interior detailing, parked at your door. Helsinki · Espoo · Vantaa.",
      },
    ],
    scripts: [
      { type: "application/ld+json", children: LD_JSON },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-background">
      <Nav />
      <main className="pb-24 md:pb-0">
        <Hero />
        <Gallery />
        <div className="py-10 md:py-14">
          <InlineBookCTA variant="compact" />
        </div>
        <Services />
        <div className="py-10 md:py-14">
          <InlineBookCTA variant="compact" />
        </div>
        <Process />
        <Setup />
        <BeyondCars />
        <OnSite />
        <Why />

        <HowItWorks />
        <Reviews />
        <InstagramSection />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <StickyBookCTA />
    </div>
  );
}
