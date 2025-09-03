import Footer from "@/components/footer";
import { Arvo } from "next/font/google";
import "./globals.css";
import Script from "next/script"; // Import Script component for analytics scripts

export const metadata = {
  metadataBase: new URL("https://haalarikone.fi"),
  title:
    "Haalarikone | Selvitä minkä värinen haalari tietyn alan opiskelijalla on!",
  description:
    "Tutustu Suomen opiskelijakulttuuriin värien kautta. Haalarikone auttaa sinua tunnistamaan eri alojen opiskelijat haalarivärien perusteella.",
  openGraph: {
    title:
      "Haalarikone | Selvitä minkä värinen haalari tietyn alan opiskelijalla on!",
    description:
      "Tutustu Suomen opiskelijakulttuuriin värien kautta. Haalarikone auttaa sinua tunnistamaan eri alojen opiskelijat haalarivärien perusteella.",
    images: ["/haalarikone-og.png"],
  },
  keywords: [
    "haalaritietokanta",
    "haalaritietokanta suomi",
    "haalarikone",
    "haalari",
    "haalarit",
    "opiskelija",
    "yliopisto",
    "korkeakoulu",
    "AMK",
    "väri",
    "värit",
    "opiskelijahaalari",
    "opiskelijahaalarit",
    "Luettelo suomalaisten opiskelijahaalarien väreistä",
    "Minkä värinen haalari tietyn alan opiskelijalla on?",
    "Haalarikulttuuri",
    "opiskelijakulttuuri",
    "värit",
    "opiskelijat",
    "opiskelu",
    "haalarivärit",
    "haalarien värit",
    "haalarien värit suomessa",
    "haalarien värit opiskelijakulttuurissa",
    "haalarien värit eri aloilla",
    "haalarien värit eri alojen opiskelijoilla",
    "haalarien värit eri alojen opiskelijakulttuureissa",
    "haalarien värit eri alojen opiskelijoiden keskuudessa",
    "haalarien värit eri alojen opiskelijoiden keskuudessa suomessa",
    "overall colors",
  ],
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
        <meta name="google-adsense-account" content="ca-pub-1662483393079789" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <Script
          defer
          data-domain="haalarikone.fi"
          src="https://analytics.bittive.com/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
        />
        <Script>
          {`window.plausible = window.plausible || function() {(window.plausible.q = window.plausible.q || []).push(arguments)}`}
        </Script>
      </head>
      <body className="min-h-screen bg-white text-foreground">
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
