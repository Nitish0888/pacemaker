"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"

export function Nav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  if (!session) return null

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/dashboard"
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/control"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/control"
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            Control
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <button
            onClick={() => signOut()}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
} 