import Footer from "@/components/footer";
import { Arvo } from "next/font/google"
import "./globals.css";
import Script from "next/script"; // Import Script component for analytics scripts

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Haalarikone | Selvitä kenelle haalarit kuuluvat",
  description: "Tutustu Suomen opiskelijakulttuuriin värien kautta. Haalarikone auttaa sinua tunnistamaan eri alojen opiskelijat haalarivärien perusteella.",
  openGraph: {
    title: "Haalarikone | Selvitä kenelle haalarit kuuluvat",
    description: "Tutustu Suomen opiskelijakulttuuriin värien kautta. Haalarikone auttaa sinua tunnistamaan eri alojen opiskelijat haalarivärien perusteella.",
    images: ['/haalarikone-og.png'],
  },
};

const arvo = Arvo({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fi" className={arvo.className} suppressHydrationWarning>
      <head>
        <Script
          defer
          data-domain="kenenhaalarit.fi"
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
