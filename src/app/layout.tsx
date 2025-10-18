import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TGM - The Gospel Mission | Connecting Hearts to His Grace",
  description: "Throne of Grace Ministries (TGM) in Wakiso Nakawuka, Uganda. Connecting hearts to God's grace through worship, fellowship, and discipleship.",
  keywords: ["church", "Uganda", "Wakiso", "Nakawuka", "Christian", "worship", "ministry", "TGM"],
  authors: [{ name: "TGM - The Gospel Mission" }],
  openGraph: {
    title: "TGM - The Gospel Mission",
    description: "Connecting Hearts to His Grace (Hebrews 4:16)",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
