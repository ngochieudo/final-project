'use client'
import Navbar from "../components/navbar/Navbar"

import ClientOnly from "../components/ClientOnly"
import ToasterProvider from "../providers/ToasterProvider"
import RegisterModal from "../components/modals/RegisterModal"
import RentModal from "../components/modals/RentModal"
import LoginModal from "../components/modals/LoginModal"


export default function HomeLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>
        <ClientOnly>
          <Navbar/>
        </ClientOnly>
        <div className="pb-20 pt-28">{children}</div> 
        </body>
      </html>
  
    )
  }