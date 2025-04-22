"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts"

interface FeatureDisplayProps {
  features: Record<string, number>
}

export function FeatureDisplay({ features }: FeatureDisplayProps) {
  // Format features for display
  const formatFeatureName = (name: string) => {
    return name.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  }

  // Prepare data for charts
  const barChartData = Object.entries(features).map(([key, value]) => ({
    name: formatFeatureName(key),
    value: Number(value.toFixed(4)),
  }))

  // Normalize data for radar chart (values between 0 and 100)
  const normalizeValue = (value: number, key: string) => {
    // Different normalization strategies based on feature type
    if (key === "energy") {
      return Math.min(100, (value / 1000) * 100)
    }

    // For most features, use a simple scaling approach
    const absValue = Math.abs(value)
    return Math.min(100, (absValue / 10) * 100)
  }

  const radarChartData = Object.entries(features)
    .filter(([key]) => !["min", "max", "energy"].includes(key)) // Exclude outliers
    .map(([key, value]) => ({
      name: formatFeatureName(key),
      value: normalizeValue(value, key),
    }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeatureCard
          title="Basic Statistics"
          features={{
            Mean: features.mean,
            Median: features.median,
            "Standard Deviation": features.std,
          }}
        />

        <FeatureCard
          title="Range Values"
          features={{
            Maximum: features.max,
            Minimum: features.min,
            IQR: features.iqr || features.q75 - features.q25,
          }}
        />

        <FeatureCard
          title="Distribution"
          features={{
            Energy: features.energy,
            Skewness: features.skewness,
            Kurtosis: features.kurtosis,
          }}
        />
      </div>

      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="radar">Radar Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="mt-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip formatter={(value) => [Number(value).toFixed(4), "Value"]} />
                <Bar dataKey="value" fill="#e11d48" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="radar" className="mt-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={radarChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Feature Value" dataKey="value" stroke="#e11d48" fill="#e11d48" fillOpacity={0.5} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-muted-foreground text-center mt-2">
            Note: Values are normalized for better visualization
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface FeatureCardProps {
  title: string
  features: Record<string, number>
}

function FeatureCard({ title, features }: FeatureCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium text-sm mb-3">{title}</h3>
        <div className="space-y-2">
          {Object.entries(features).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{key}:</span>
              <span className="text-sm font-medium">{value.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
