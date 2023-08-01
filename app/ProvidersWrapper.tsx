"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export default function ProvidersWrapper({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <SessionProvider>
      {children}
      {/* Entire app -> has access to NextAuth */}
    </SessionProvider>
  );
}
