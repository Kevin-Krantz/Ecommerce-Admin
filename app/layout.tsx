"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

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
