import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mini-Indobat Inventory',
  description: 'Sistem Manajemen Stok Farmasi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="min-h-screen bg-base-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            theme="colored"
          />
        </div>
      </body>
    </html>
  )
}

import { BriefcaseMedical } from 'lucide-react'

function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl">
          <BriefcaseMedical className="w-6 h-6 text-primary" />
          <span className="ml-2">PBF Farmasi</span>
        </a>
      </div>
    </div>
  )
}