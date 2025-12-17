import SearchContainer from "@/components/search-container";
import { loadUniversities } from "@/lib/load-universities";
import FAQSchema from "@/components/faq-schema";
import Script from "next/script";
import { FeedbackModal } from "@/components/feedback-modal";

export const revalidate = 3600;

export default async function Index() {
  const universities = await loadUniversities();

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Haalarikone",
    url: "https://haalarikone.fi",
    description:
      "Suomen helpoin haalaritietokanta. Selvitä minkä värinen haalari tietyn alan opiskelijalla on!",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://haalarikone.fi?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Haalarikone",
    url: "https://haalarikone.fi",
    description: "Suomen helpoin haalaritietokanta opiskelijahaalariväreille",
    logo: {
      "@type": "ImageObject",
      url: "https://haalarikone.fi/haalarikone-og.png",
      width: 1200,
      height: 630,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: "Finnish",
    },
    sameAs: [],
  };

  return (
    <>
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <FAQSchema />
      <div className="bg-white w-full min-h-screen flex flex-col items-center">
        <div className="flex flex-col items-center justify-center pt-8 pb-4">

          <div className="relative">
            <h1
              className="w-fit text-4xl md:text-7xl font-bold text-center"
              style={{
                background:
                  "linear-gradient(120deg, #65a30d 0%, #65a30d 100%) no-repeat",
                backgroundPosition: "0 95%",
                backgroundSize: "100% 0.25em",
                fontWeight: "inherit",
                color: "inherit",
              }}
            >
              Haalarikone
            </h1>
          </div>

          <p className="text-center max-w-2xl mx-auto px-4 mt-6 mb-4">
            Suomen kattavin haalareiden tietokanta. Löydä yli 500 haalariväriä
            yliopistoista ja AMK:ista. Selvitä minkä värinen haalari tietyn alan
            opiskelijalla on.
          </p>
        </div>
        <SearchContainer initialUniversities={universities} />

        <section
          id="palaute"
          className="w-full border-t border-border/60 bg-[#f8faf3] mt-12"
        >
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center flex flex-col gap-4">
              <h3 className="text-2xl font-bold">
                Anna palautetta tai ideoita
              </h3>
              <p className="text-muted-foreground">
                Kaikki kehitysehdotukset, bugiraportit ja ideat auttavat meitä
                parantamaan Haalarikonetta.
              </p>
              <FeedbackModal
                triggerLabel="Anna palautetta"
                triggerClassName="bg-green text-white hover:bg-green/90 self-center"
                triggerSize="lg"
                title="Anna palautetta tai ideoita"
                description="Kaikki kehitysehdotukset, bugiraportit ja ideat auttavat meitä parantamaan Haalarikonetta."
                submitLabel="Lähetä palaute"
                messageLabel="Palautteesi"
                messagePlaceholder="Kerro mikä toimii tai ei toimi, ja mitä toivoisit lisää."
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
