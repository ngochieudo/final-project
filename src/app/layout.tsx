
import './globals.css'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

import Footer from './components/Footer'
import Providers from './components/Providers'
import ToasterProvider from './providers/ToasterProvider'
import RegisterModal from './components/modals/RegisterModal'
import RentModal from './components/modals/RentModal'
import LoginModal from './components/modals/LoginModal'

export const metadata: Metadata = {
  title: 'Pep | Cho thuê chỗ ở',
  description: 'Final project',
}

const font = Nunito({
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Providers>
        <ToasterProvider />
          <RegisterModal />
          <RentModal/>
          <LoginModal/>
        <div>
          {children}
        </div>
        </Providers>
      </body>
    </html>
  )
}
