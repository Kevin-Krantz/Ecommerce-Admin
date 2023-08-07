"use client";
import "./globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "asdasdas",
  description: "asdasdasd",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html>
      <SessionProvider>
        <body>{children}</body>
      </SessionProvider>
    </html>
  );
}
