"use client";

import ClientOnly from "../components/ClientOnly";
import { SessionProvider } from "next-auth/react";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div>{children}</div>
    </SessionProvider>
  );
}
