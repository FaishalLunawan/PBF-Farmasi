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

import { Package, Home, ShoppingCart } from 'lucide-react'

function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a href="/"><Home className="w-4 h-4" /> Dashboard</a></li>
            <li><a href="#"><Package className="w-4 h-4" /> Produk</a></li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">
          <Package className="w-6 h-6 text-primary" />
          <span className="ml-2">Mini-Indobat</span>
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a href="/"><Home className="w-4 h-4" /> Dashboard</a></li>
          <li><a href="#"><ShoppingCart className="w-4 h-4" /> Transaksi</a></li>
        </ul>
      </div>
      <div className="navbar-end">
        <button className="btn btn-primary">
          <ShoppingCart className="w-4 h-4" />
          <span className="ml-2">Order Baru</span>
        </button>
      </div>
    </div>
  )
}