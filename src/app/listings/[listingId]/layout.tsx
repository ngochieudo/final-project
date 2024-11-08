'use client'
import Breadcrumb from "@/app/components/Breadcrumb"
import { SessionProvider } from "next-auth/react"

export default function ListingDetailLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <SessionProvider>
        <Breadcrumb
          homeElement={"Home"}
          separator={<span> | </span>}
          activeClasses="text-blue-500 font-light"
          containerClasses="flex py-5 blue-500 mt-6"
          listClasses="hover:underline mx-2 font-bold"
          capitalizeLinks
        />
        {children}
      </SessionProvider>
    )
  }