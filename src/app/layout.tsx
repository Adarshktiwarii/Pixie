import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Shell } from "@/components/layout/Shell";
import { PixieProvider } from "@/lib/context";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Pixie | Digital Pet Health Passport",
  description: "A lifelong digital health record and companion platform for pets.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pixie",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
        <PixieProvider>
          <Shell>{children}</Shell>
          <Toaster position="bottom-right" richColors />
        </PixieProvider>
      </body>
    </html>
  );
}
