"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/auth/AuthProvider";
import { QueryClientProvider, QueryClient } from "@lf/shared";
import { MobileNavBar } from "@/components/composites/MobileNavBar";
import { useAuthRedirect } from "@/auth/useAuthRedirect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useAuthRedirect();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <MobileNavBar
              title={"Lazy friends"}
              items={[
                { label: "Home", href: "/" },
                { label: "Groups", href: "/group" },
                { label: "Log in", href: "/login" },
                { label: "Log out", href: "/logout" },
                { label: "Profile", href: "/profile" },
              ]}
            />
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
