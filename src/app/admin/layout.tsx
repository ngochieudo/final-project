'use client'

import ClientOnly from "../components/ClientOnly"
import { SidebarRoutes } from "../components/admin/SidebarRoutes"
import AdminNavbar from "../components/admin/navbar/AdminNavbar"


export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>
          <AdminNavbar/>
          <div className="flex flex-row">
            <SidebarRoutes/>
            <div className="w-5/6">{children}</div> 
          </div>
        </body>
      </html>
  
    )
  }