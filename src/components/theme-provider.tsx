"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin") ?? false

  return (
    <NextThemesProvider
      {...props}
      enableSystem={isAdmin ? false : props.enableSystem}
      forcedTheme={isAdmin ? "light" : props.forcedTheme}
    >
      {children}
    </NextThemesProvider>
  )
}
