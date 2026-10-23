import { Header } from "@/components/layout/Header";
import { Footer, FinalCTA } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Experience, Services } from "@/components/sections/Services";
import { TransformVehicle } from "@/components/sections/TransformVehicle";
import { Transformation } from "@/components/sections/Transformation";
import { Tint } from "@/components/sections/Tint";
import { Film } from "@/components/sections/Film";
import { Process } from "@/components/sections/Process";
import { Gallery } from "@/components/sections/Gallery";
import { Packages } from "@/components/sections/Packages";
import { Reviews } from "@/components/sections/Reviews";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { business } from "@/lib/content";
import { Preloader } from "@/components/animations/Preloader";
const schema = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  "@id": "https://www.detailcliniclacrosse.com/#business",
  name: business.name,
  url: "https://www.detailcliniclacrosse.com",
  email: business.email,
  telephone: "+1-608-797-5137",
  image: "https://www.detailcliniclacrosse.com/images/studio.webp",
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address,
    addressLocality: "La Crosse",
    addressRegion: "WI",
    postalCode: "54601",
    addressCountry: "US",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "08:00",
    closes: "18:00",
  },
  areaServed: { "@type": "City", name: "La Crosse" },
  hasMap: business.reviews,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Auto detailing and window tint",
    itemListElement: [
      "Interior detailing",
      "Full service detailing",
      "Exterior detailing",
      "Paint correction",
      "Ceramic coating",
      "Window tint",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
  },
};
export default function Home() {
  return (
    <>
      <Preloader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header />
      <main id="main">
        <Hero />
        <Experience />
        <TransformVehicle />
        <Transformation />
        <Services />
        <Film />
        <Tint />
        <Process />
        <Gallery />
        <Packages />
        <Reviews />
        <About />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
