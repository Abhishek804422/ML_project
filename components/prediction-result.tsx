"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
  Legend,
} from "recharts"
import { AlertTriangle, Clock, Download, Share } from "lucide-react"

interface PredictionResultProps {
  prediction: number
}

export function PredictionResult({ prediction }: PredictionResultProps) {
  const [confidenceLevel, setConfidenceLevel] = useState(0.95)

  // Calculate confidence interval (this would normally come from the model)
  const standardError = prediction * 0.1 // Simulated standard error (10% of prediction)
  const zScore = 1.96 // 95% confidence interval
  const marginOfError = zScore * standardError
  const lowerBound = Math.max(0, prediction - marginOfError)
  const upperBound = prediction + marginOfError

  // Generate sample data for visualizations
  const generateSampleData = () => {
    // Generate sample loss curve data
    const lossData = Array.from({ length: 20 }, (_, i) => ({
      epoch: i + 1,
      loss: 0.5 * Math.exp(-0.2 * i) + 0.05 * Math.random(),
      valLoss: 0.6 * Math.exp(-0.18 * i) + 0.1 * Math.random(),
    }))

    // Generate sample scatter plot data
    const scatterData = Array.from({ length: 30 }, (_, i) => {
      const actual = prediction * (0.7 + 0.6 * Math.random())
      return {
        actual,
        predicted: actual + (Math.random() - 0.5) * actual * 0.3,
      }
    })

    return { lossData, scatterData }
  }

  const { lossData, scatterData } = generateSampleData()

  // Format time for display
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds.toFixed(2)} seconds`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes} min ${remainingSeconds.toFixed(0)} sec`
    } else {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      return `${hours} hr ${minutes} min`
    }
  }

  // Calculate risk level based on prediction
  const getRiskLevel = (seconds: number) => {
    if (seconds < 10) {
      return { level: "Critical", color: "text-red-600", bg: "bg-red-50" }
    } else if (seconds < 30) {
      return { level: "High", color: "text-orange-600", bg: "bg-orange-50" }
    } else if (seconds < 60) {
      return { level: "Moderate", color: "text-amber-600", bg: "bg-amber-50" }
    } else {
      return { level: "Low", color: "text-green-600", bg: "bg-green-50" }
    }
  }

  const riskLevel = getRiskLevel(prediction)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`${riskLevel.bg} border-l-4 border-l-${riskLevel.color.replace("text-", "border-")}`}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`p-3 rounded-full ${riskLevel.bg}`}>
                <Clock className={`h-8 w-8 ${riskLevel.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Predicted Time to Failure</h3>
                <p className={`text-3xl font-bold ${riskLevel.color}`}>{formatTime(prediction)}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  95% Confidence Interval: {formatTime(lowerBound)} - {formatTime(upperBound)}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full ${riskLevel.bg} ${riskLevel.color} text-sm font-medium`}>
                {riskLevel.level} Risk
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Interpretation</h3>
            <div className="space-y-4 text-sm">
              <p>
                Based on the seismic signal analysis, the model predicts an earthquake event in approximately{" "}
                <strong>{formatTime(prediction)}</strong>.
              </p>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  This prediction is based on machine learning analysis and should be used in conjunction with other
                  monitoring systems. Always follow official emergency protocols.
                </p>
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Export Report
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Share className="h-3 w-3 mr-1" />
                  Share Results
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scatter" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scatter">Prediction Accuracy</TabsTrigger>
          <TabsTrigger value="loss">Model Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="scatter" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-4">Predicted vs Actual (Sample Data)</h4>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      type="number"
                      dataKey="actual"
                      name="Actual"
                      label={{ value: "Actual Time (s)", position: "insideBottomRight", offset: -5 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="predicted"
                      name="Predicted"
                      label={{ value: "Predicted Time (s)", angle: -90, position: "insideLeft" }}
                    />
                    <ZAxis range={[60, 60]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      formatter={(value) => [Number(value).toFixed(2), ""]}
                    />
                    <ReferenceLine y={0} stroke="#666" />
                    <ReferenceLine
                      segment={[
                        { x: 0, y: 0 },
                        { x: 100, y: 100 },
                      ]}
                      stroke="red"
                      strokeDasharray="3 3"
                    />
                    <Scatter name="Predictions" data={scatterData} fill="#e11d48" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Note: This is sample data for demonstration purposes
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loss" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-4">Model Training Loss</h4>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lossData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="epoch" label={{ value: "Epoch", position: "insideBottomRight", offset: -5 }} />
                    <YAxis label={{ value: "Loss", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="loss" stroke="#e11d48" name="Training Loss" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="valLoss" stroke="#3b82f6" name="Validation Loss" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Note: This is sample data for demonstration purposes
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
