"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Nav } from "@/components/nav"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HeartbeatAnimation } from "@/components/ui/heartbeat-animation"
import { HeartbeatWaveform } from "@/components/ui/heartbeat-waveform"

// Mock data for demonstration
function generateMockData() {
  return Array.from({ length: 20 }, (_, i) => ({
    time: new Date(Date.now() - (19 - i) * 1000).toLocaleTimeString(),
    bpm: Math.floor(Math.random() * 40) + 60,
  }))
}

export default function DashboardPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [bpmData, setBpmData] = useState(generateMockData())
  const [currentBpm, setCurrentBpm] = useState(0)
  const [pacemakerStatus, setPacemakerStatus] = useState<"Normal" | "Stimulating" | "No Signal">("Normal")

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login")
    }
  }, [authStatus, router])

  useEffect(() => {
    const interval = setInterval(() => {
      const newBpm = Math.floor(Math.random() * 40) + 60
      setCurrentBpm(newBpm)
      setBpmData(prev => [...prev.slice(1), { time: new Date().toLocaleTimeString(), bpm: newBpm }])
      
      if (newBpm < 60) {
        setPacemakerStatus("Stimulating")
      } else if (newBpm > 100) {
        setPacemakerStatus("No Signal")
      } else {
        setPacemakerStatus("Normal")
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (authStatus === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Nav />
      <div className="container mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardTitle>Current Heart Rate</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <HeartbeatAnimation bpm={currentBpm} status={pacemakerStatus} />
                <div className="text-4xl font-bold text-center">{currentBpm} BPM</div>
                <div className="text-center">
                  <Badge 
                    variant={pacemakerStatus === "Normal" ? "default" : "destructive"}
                    className="text-lg px-4 py-1"
                  >
                    {pacemakerStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardTitle>Live Heartbeat Waveform</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[200px]">
                <HeartbeatWaveform bpm={currentBpm} status={pacemakerStatus} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardTitle>Heart Rate History</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bpmData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#6b7280"
                    tick={{ fill: "#6b7280" }}
                  />
                  <YAxis 
                    domain={[40, 120]} 
                    stroke="#6b7280"
                    tick={{ fill: "#6b7280" }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bpm" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, fill: "#3b82f6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 