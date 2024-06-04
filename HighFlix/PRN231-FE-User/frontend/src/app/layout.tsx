import './globals.css'
import AuthProvider from '../provider/AuthProvider'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavbarWithCTAButton from '@/components/Navbar/NavbarWithCTAButton'
import FooterWithSocialMediaIcons from '@/components/Footer/PageFooter'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HighFlix',
  description: 'The semester 8 production of HighTeam',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <html lang='en'>
        <body
          className={`${inter.className} px-[1rem] md:px-[2rem] lg:px-[3rem] xl:px-[10rem]`}
        >
          <NavbarWithCTAButton />
          {children}
          <FooterWithSocialMediaIcons />
        </body>
      </html>
    </AuthProvider>
  )
}
