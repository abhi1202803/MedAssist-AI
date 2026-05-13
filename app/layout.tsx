import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import './styles/globals.css'
import Navbar from './components/Navbar'
import { ThemeProvider } from "./providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Care AI",
  description: "AI Medical Chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="header.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
