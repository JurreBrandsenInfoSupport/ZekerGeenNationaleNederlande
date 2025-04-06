import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ZekerGeenNationaleNederlande - Insurance Management Platform",
  description:
    "A comprehensive insurance management platform for policy management, claims processing, and customer accounts",
  icons: {
    icon: "/favicon.ico",
  },
}

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Customers", href: "/customers" },
  { name: "Policies", href: "/policies" },
  { name: "Claims", href: "/claims" },
  { name: "Payments", href: "/payments" },
  { name: "Reports", href: "/reports" },
  { name: "Settings", href: "/settings" },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 w-full border-b bg-background">
              <div className="container flex h-16 items-center">
                <MainNav />
                <div className="ml-auto flex items-center space-x-4">
                  <UserNav />
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
          <Toaster containerClassName="z-[100]" />
        </ThemeProvider>
      </body>
    </html>
  )
}