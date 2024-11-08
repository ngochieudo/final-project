import "./globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import ToasterProvider from "./providers/ToasterProvider";
import RegisterModal from "./components/modals/RegisterModal";
import RentModal from "./components/modals/RentModal";
import LoginModal from "./components/modals/LoginModal";
import ClientOnly from "./components/ClientOnly";


export const metadata: Metadata = {
  title: "Pep | Booking website",
  description: "Final project",
};

const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className} suppressHydrationWarning={true}>
        <ClientOnly>
          <ToasterProvider />
          <RegisterModal />
          <RentModal />
          <LoginModal />
          <div>{children}</div>
          {/* <Footer/> */}
        </ClientOnly>
      </body>
    </html>
  );
}
