"use client"

import { useState } from "react"
import Image from "next/image"

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
        className={`flex shrink-0 items-center justify-center rounded-lg bg-primary/10 font-serif font-bold text-primary ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {name.charAt(0)}
      </div>
    )
  }

  return (
    <Image
      src={logoUrl}
      alt={`${name} logo`}
      width={size}
      height={size}
      className={`shrink-0 rounded-lg bg-secondary object-contain ${className}`}
      style={{ width: size, height: size, padding: size * 0.15 }}
      onError={() => setHasError(true)}
    />
  )
}
