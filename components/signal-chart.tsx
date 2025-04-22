"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

interface SignalChartProps {
  data: number[]
}

export function SignalChart({ data }: SignalChartProps) {
  const [chartData, setChartData] = useState<Array<{ index: number; value: number }>>([])
  const [chartType, setChartType] = useState<"line" | "area">("line")

  useEffect(() => {
    // Convert the raw data array to the format expected by Recharts
    const formattedData = data.map((value, index) => ({
      index,
      value,
    }))

    // If there's too much data, sample it to improve performance
    const sampledData = sampleData(formattedData, 1000)
    setChartData(sampledData)
  }, [data])

  // Function to sample data points for better performance with large datasets
  const sampleData = (data: Array<{ index: number; value: number }>, maxPoints: number) => {
    if (data.length <= maxPoints) return data

    const samplingRate = Math.ceil(data.length / maxPoints)
    return data.filter((_, i) => i % samplingRate === 0)
  }

  return (
    <div className="w-full space-y-4">
      <Tabs value={chartType} onValueChange={(value) => setChartType(value as "line" | "area")} className="w-full">
        <div className="flex justify-end mb-2">
          <TabsList>
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="area">Area</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="line" className="mt-0">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="index"
                  label={{ value: "Time", position: "insideBottomRight", offset: -5 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis label={{ value: "Amplitude", angle: -90, position: "insideLeft" }} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [Number(value).toFixed(4), "Signal"]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#e11d48"
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                  name="Signal"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="area" className="mt-0">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="index"
                  label={{ value: "Time", position: "insideBottomRight", offset: -5 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis label={{ value: "Amplitude", angle: -90, position: "insideLeft" }} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [Number(value).toFixed(4), "Signal"]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Area type="monotone" dataKey="value" stroke="#e11d48" fill="#fecdd3" strokeWidth={1.5} name="Signal" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-xs text-muted-foreground text-center">
        {data.length > 1000
          ? `Showing sampled data (${chartData.length} of ${data.length} points)`
          : `Showing all ${data.length} data points`}
      </div>
    </div>
  )
}
