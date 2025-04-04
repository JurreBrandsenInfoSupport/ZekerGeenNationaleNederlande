"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="font-bold text-xl text-primary">
          ZekerGeen<span className="text-foreground">NationaleNederlande</span>
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/policies"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/policies" || pathname.startsWith("/policies/") ? "text-primary" : "text-muted-foreground",
          )}
        >
          Policies
        </Link>
        <Link
          href="/claims"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/claims" || pathname.startsWith("/claims/") ? "text-primary" : "text-muted-foreground",
          )}
        >
          Claims
        </Link>
        <Link
          href="/customers"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/customers" || pathname.startsWith("/customers/") ? "text-primary" : "text-muted-foreground",
          )}
        >
          Customers
        </Link>
      </nav>
    </div>
  )
}

