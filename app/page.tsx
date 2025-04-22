import type { Metadata } from "next"
import EarthquakePrediction from "@/components/earthquake-prediction"

export const metadata: Metadata = {
  title: "Earthquake Prediction from Seismic Signals",
  description: "Predict earthquake time to failure from seismic signal data",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <EarthquakePrediction />
    </main>
  )
}
