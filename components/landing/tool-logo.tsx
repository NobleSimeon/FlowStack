"use client"

import { useState } from "react"

interface ToolLogoProps {
  name: string
  logoUrl: string
  size?: number
  className?: string
}

export function ToolLogo({ name, logoUrl, size = 40, className = "" }: ToolLogoProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError || !logoUrl) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-xl bg-secondary font-semibold text-foreground ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.38 }}
      >
        {name.charAt(0)}
      </div>
    )
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-secondary ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt={`${name} logo`}
        width={size * 0.6}
        height={size * 0.6}
        className="object-contain"
        style={{ width: size * 0.6, height: size * 0.6 }}
        onError={() => setHasError(true)}
        crossOrigin="anonymous"
      />
    </div>
  )
}
