import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import SidebarWrapper from "../components/SidebarWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Healthcare Admin",
  description: "Admin panel for healthcare system",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <SidebarWrapper />
          <main className="flex-1 transition-[padding] duration-300">{children}</main>
        </div>
      </body>
    </html>
  )
}
