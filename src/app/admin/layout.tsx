"use client";
import { SessionProvider } from "next-auth/react";
import Breadcrumb from "../components/Breadcrumb";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {/* <SidebarRoutes/> */}
      <Breadcrumb
        homeElement={"Home"}
        separator={<span> | </span>}
        activeClasses="text-blue-500 font-light"
        containerClasses="flex py-5 blue-500"
        listClasses="hover:underline mx-2 font-bold"
        capitalizeLinks
      />
      <div>{children}</div>
    </SessionProvider>
  );
}
