"use client";
import Navbar from "../components/navbar/Navbar";
import ClientOnly from "../components/ClientOnly";
import { SessionProvider } from "next-auth/react";
import Breadcrumb from "../components/Breadcrumb";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ClientOnly>
        <Navbar />
      </ClientOnly>
      <div className="pb-20 pt-28 px-5">
        <Breadcrumb
          homeElement={"Home"}
          separator={<span> | </span>}
          activeClasses="text-blue-500 font-light"
          containerClasses="flex py-5 blue-500"
          listClasses="hover:underline mx-2 font-bold"
          capitalizeLinks
        />
        {children}
      </div>
    </SessionProvider>
  );
}
