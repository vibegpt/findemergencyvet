import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-[#f6f7f8] dark:bg-[#101922]`}>
        {children}
      </body>
    </html>
  );
}
