import { Poppins, Inter } from "next/font/google";
import type { ReactNode } from "react";
import "../globals.css";
import SiteConvexProvider from "@/components/SiteConvexProvider";
import { AppQueryProvider } from "@/lib/query-client";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/lib/toast-context";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GlobalSections from "@/components/GlobalSections";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Care Connect — Care That Comes to You",
  description:
    "Find and manage trusted in-home care for the people you love, without the runaround.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cloud text-ink">
        <SiteConvexProvider>
          <AppQueryProvider>
            <AuthProvider>
              <ToastProvider>
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <GlobalSections />
                <SiteFooter />
              </ToastProvider>
            </AuthProvider>
          </AppQueryProvider>
        </SiteConvexProvider>
      </body>
    </html>
  );
}
