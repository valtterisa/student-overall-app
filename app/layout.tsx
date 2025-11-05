import Footer from "@/components/footer";
import { Arvo } from "next/font/google";
import "./globals.css";
import { Databuddy } from "@databuddy/sdk/react";

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
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-white text-foreground">
        <main className="flex flex-col items-center">
          <div className="flex-1 w-full flex flex-col gap-20 items-center">
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
