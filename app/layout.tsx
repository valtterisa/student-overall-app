import Footer from "@/components/footer";
import Header from "@/components/header";
import { Arvo } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Databuddy } from "@databuddy/sdk/react";

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
  authors: [{ name: "Haalarikone" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title:
      "Haalarikone | Selvitä minkä värinen haalari tietyn alan opiskelijalla on!",
    description:
      "Tutustu Suomen opiskelijakulttuuriin värien kautta. Haalarikone auttaa sinua tunnistamaan eri alojen opiskelijat haalarivärien perusteella.",
    images: [
      {
        url: "/haalarikone-og.png",
        width: 1200,
        height: 630,
        alt: "Haalarikone - Suomen helpoin haalaritietokanta",
      },
    ],
    type: "website",
    siteName: "Haalarikone",
    locale: "fi_FI",
    url: "https://haalarikone.fi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Haalarikone | Suomen helpoin haalaritietokanta",
    description: "Tutustu Suomen opiskelijakulttuuriin värien kautta",
    images: ["/haalarikone-og.png"],
  },
  alternates: {
    canonical: "https://haalarikone.fi",
    languages: {
      fi: "https://haalarikone.fi",
    },
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
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-white text-foreground">
        <main className="flex flex-col items-center">
          <div className="flex-1 w-full flex flex-col items-center">
            {children}
            <Databuddy
              clientId="Uu3N9TuBuUAa3wAS4pHNw"
              trackOutgoingLinks={true}
              trackInteractions={true}
              trackEngagement={true}
              trackExitIntent={true}
              trackBounceRate={true}
              trackWebVitals={true}
              trackErrors={true}
              enableBatching={true}
            />
            <Footer />
          </div>
        </main>
      </body>
    </html>
  );
}
