"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface HeartbeatAnimationProps {
  bpm: number
  status: "Normal" | "Stimulating" | "No Signal"
  className?: string
}

export function HeartbeatAnimation({ bpm, status, className }: HeartbeatAnimationProps) {
  const [isBeating, setIsBeating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBeating(true)
      setTimeout(() => setIsBeating(false), 200)
    }, (60 / bpm) * 1000)

    return () => clearInterval(interval)
  }, [bpm])

  return (
    <div className={cn("relative w-24 h-24", className)}>
      <svg
        viewBox="0 0 24 24"
        className={cn(
          "w-full h-full transition-transform duration-200",
          isBeating ? "scale-110" : "scale-100",
          status === "Normal" ? "text-green-500" :
          status === "Stimulating" ? "text-yellow-500" :
          "text-red-500"
        )}
        fill="currentColor"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium">{bpm}</span>
      </div>
    </div>
  )
} 