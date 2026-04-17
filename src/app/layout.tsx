import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";

import { Providers } from "@/components/providers";
import { appName } from "@/lib/constants";

import "./globals.css";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: `${appName} | قائمة مهام عربية احترافية`,
  description: "تطبيق عربي حديث لإدارة المهام مع لوحة تحكم وإحصاءات ومصادقة آمنة."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${ibmPlexArabic.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
