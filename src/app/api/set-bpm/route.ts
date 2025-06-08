import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const bpm = searchParams.get("bpm")

  if (!bpm) {
    return NextResponse.json(
      { error: "BPM parameter is required" },
      { status: 400 }
    )
  }

  const bpmValue = parseInt(bpm)
  if (isNaN(bpmValue) || bpmValue < 30 || bpmValue > 180) {
    return NextResponse.json(
      { error: "BPM must be between 30 and 180" },
      { status: 400 }
    )
  }

  try {
    // In a real application, this would make a request to the ESP32
    // const response = await fetch(`http://<ESP32_IP>/set?bpm=${bpmValue}`)
    // if (!response.ok) throw new Error("Failed to set BPM on ESP32")

    // For now, we'll just simulate a successful response
    return NextResponse.json({ success: true, bpm: bpmValue })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to set BPM" },
      { status: 500 }
    )
  }
} 