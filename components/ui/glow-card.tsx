"use client"

import React, { useRef, useState } from "react"

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: string
}

export function GlowCard({
  children,
  className = "",
  style,
  glowColor = "rgba(245, 158, 11, 0.15)",
  ...props
}: GlowCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-xl border bg-card transition-colors duration-300 ${className}`}
      style={style}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 70%)`,
        }}
      />
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}