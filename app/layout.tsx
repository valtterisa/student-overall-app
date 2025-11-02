import Footer from "@/components/footer";
import Header from "@/components/header";
import { Arvo } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import FAQSchema from "@/components/faq-schema";

export const metadata = {
  metadataBase: new URL("https://haalarikone.fi"),
  title:
    "Haalarikone | Selvitä minkä värinen haalari tietyn alan opiskelijalla on!",
  description:
    "Tutustu Suomen opiskelijakulttuuriin värien kautta. Haalarikone auttaa sinua tunnistamaan eri alojen opiskelijat haalarivärien perusteella.",
  keywords: [
    "haalarikone",
    "haalaritietokanta",
    "haalarien värit",
    "opiskelijahaalarit",
    "suomen opiskelijakulttuuri",
    "yliopiston haalarivärit",
    "AMK haalarit",
  ],
  openGraph: {
    title:
      "Haalarikone | Selvitä minkä värinen haalari tietyn alan opiskelijalla on!",
    description:
      "Tutustu Suomen opiskelijakulttuuriin värien kautta. Haalarikone auttaa sinua tunnistamaan eri alojen opiskelijat haalarivärien perusteella.",
    images: ["/haalarikone-og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Haalarikone | Suomen helpoin haalaritietokanta",
    description:
      "Tutustu Suomen opiskelijakulttuuriin värien kautta",
    images: ["/haalarikone-og.png"],
  },
  alternates: {
    canonical: "https://haalarikone.fi",
  },
};

const arvo = Arvo({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fi" className={arvo.className} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <Script
          defer
          data-domain="haalarikone.fi"
          src="https://analytics.bittive.com/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
        />
        <Script>
          {`window.plausible = window.plausible || function() {(window.plausible.q = window.plausible.q || []).push(arguments)}`}
        </Script>
        <Script
          id="webapplication-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Haalarikone",
              description:
                "Suomen helpoin haalaritietokanta - selvitä minkä värinen haalari tietyn alan opiskelijalla on",
              url: "https://haalarikone.fi",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "EUR",
              },
            }),
          }}
        />
        <FAQSchema />
      </head>
      <body className="min-h-screen bg-white text-foreground">
        <Header />
        <main className="flex flex-col items-center">
          <div className="flex-1 w-full flex flex-col gap-20 items-center">
            {children}
            <Footer />
          </div>
        </main>
      </body>
    </html>
  );
}
