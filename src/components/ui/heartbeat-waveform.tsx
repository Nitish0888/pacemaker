"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface HeartbeatWaveformProps {
  bpm: number
  status: "Normal" | "Stimulating" | "No Signal"
  className?: string
}

export function HeartbeatWaveform({ bpm, status, className }: HeartbeatWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const draw = () => {
      const width = canvas.width
      const height = canvas.height
      ctx.clearRect(0, 0, width, height)

      // Set line style based on status
      ctx.strokeStyle = status === "Normal" ? "#22c55e" :
                       status === "Stimulating" ? "#eab308" :
                       "#ef4444"
      ctx.lineWidth = 2

      // Draw the heartbeat waveform
      ctx.beginPath()
      for (let x = 0; x < width; x++) {
        const t = (x / width) * 2 * Math.PI + time
        const y = height / 2 + 
          Math.sin(t) * 20 + 
          Math.sin(t * 2) * 10 + 
          Math.sin(t * 4) * 5
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // Update time for animation
      time += 0.05
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [status])

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={100}
      className={cn("w-full h-full", className)}
    />
  )
} 