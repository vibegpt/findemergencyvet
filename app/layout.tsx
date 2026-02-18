import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "FindEmergencyVet.com - Emergency Veterinary Care Near You",
  description: "Find emergency vets open now. Real-time availability, exotic pet specialists, 24/7 hospitals. Every second counts for your pet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1ZWQKBJHXM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1ZWQKBJHXM');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
