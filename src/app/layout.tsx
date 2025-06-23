import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "@/context/SessionContext";
import { currentSession } from "@/lib/session";

const workSans = localFont({
  src: [
    {
      path: "../fonts/WorkSans-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/WorkSans-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/WorkSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/WorkSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/WorkSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/WorkSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/WorkSans-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/WorkSans-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/WorkSans-Thin.ttf",
      weight: "100",
      style: "normal",
    },
  ],
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: "Video Conferencing App",
  description: "A video conferencing app built with Stream Video",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const payload = await currentSession();

  return (
    <html lang="en">
      <SessionProvider initialUser={payload ?? null}>
        <body className={`${workSans.variable}  antialiased`}>
          <Toaster />
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
