"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Nav } from "@/components/nav"
import { useToast } from "@/components/ui/use-toast"

export default function ControlPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [bpm, setBpm] = useState(60)
  const [isLoading, setIsLoading] = useState(false)

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real application, replace this with your ESP32's IP address
      const response = await fetch(`http://localhost:3000/api/set-bpm?bpm=${bpm}`)
      
      if (response.ok) {
        toast({
          title: "Success",
          description: `BPM set to ${bpm}`,
        })
      } else {
        throw new Error("Failed to set BPM")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set BPM. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Control Panel</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="bpm"
                  className="block text-sm font-medium text-gray-700"
                >
                  Target Heart Rate (BPM)
                </label>
                <div className="mt-2">
                  <input
                    type="range"
                    id="bpm"
                    name="bpm"
                    min="30"
                    max="180"
                    value={bpm}
                    onChange={(e) => setBpm(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="mt-2 text-center text-2xl font-bold text-indigo-600">
                    {bpm} BPM
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                >
                  {isLoading ? "Setting..." : "Set BPM"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
} 