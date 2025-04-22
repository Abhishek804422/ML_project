"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { FileUploader } from "@/components/file-uploader"
import { SignalChart } from "@/components/signal-chart"
import { FeatureDisplay } from "@/components/feature-display"
import { PredictionResult } from "@/components/prediction-result"
import { processSignalData } from "@/lib/process-signal"
import { extractFeatures } from "@/lib/extract-features"
import { predictTimeToFailure } from "@/lib/predict"
import { AlertCircle, FileText, Info, AudioWaveformIcon as Waveform } from "lucide-react"

export default function EarthquakePrediction() {
  const [signalData, setSignalData] = useState<number[] | null>(null)
  const [features, setFeatures] = useState<Record<string, number> | null>(null)
  const [prediction, setPrediction] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("upload")

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true)
    setError(null)

    try {
      // Process the uploaded CSV file
      const data = await processSignalData(file)
      setSignalData(data)

      // Extract features from the signal
      const extractedFeatures = extractFeatures(data)
      setFeatures(extractedFeatures)

      // Make prediction
      const result = await predictTimeToFailure(data)
      setPrediction(result)

      // Move to visualization tab
      setActiveTab("visualization")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  const resetData = () => {
    setSignalData(null)
    setFeatures(null)
    setPrediction(null)
    setError(null)
    setActiveTab("upload")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <div className="flex items-center gap-2 mb-2">
          <Waveform className="h-8 w-8 text-rose-600" />
          <h1 className="text-3xl font-bold tracking-tight">Earthquake Prediction</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Upload seismic signal data to predict the time to failure using machine learning
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="visualization" disabled={!signalData}>
              Visualization
            </TabsTrigger>
            <TabsTrigger value="prediction" disabled={!prediction}>
              Prediction
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Seismic Signal Data</CardTitle>
                <CardDescription>Upload a CSV file containing a single column of seismic signal data</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader onFileUpload={handleFileUpload} isProcessing={isProcessing} />
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 text-blue-500" />
                  <div className="text-sm text-muted-foreground">
                    <p>
                      The CSV file should contain a single column of numerical values representing the seismic signal.
                    </p>
                    <p>Example filename: seg_0620e6.csv</p>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>About This Tool</CardTitle>
                <CardDescription>How earthquake prediction works</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-lg">
                      <FileText className="h-8 w-8 text-slate-700 mb-2" />
                      <h3 className="font-medium">1. Upload Data</h3>
                      <p className="text-sm text-muted-foreground">Upload your seismic signal CSV file</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 text-slate-700 mb-2"
                      >
                        <path d="M2 12h20"></path>
                        <path d="M6 8l-4 4 4 4"></path>
                        <path d="M18 8l4 4-4 4"></path>
                      </svg>
                      <h3 className="font-medium">2. Process Signal</h3>
                      <p className="text-sm text-muted-foreground">Extract features and preprocess data</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 text-slate-700 mb-2"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                      <h3 className="font-medium">3. Get Prediction</h3>
                      <p className="text-sm text-muted-foreground">View the predicted time to failure</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">How it works</h3>
                    <p className="text-sm text-muted-foreground">
                      This tool uses a deep learning model trained on seismic signal data to predict the time until an
                      earthquake occurs. The model analyzes patterns in the signal that are indicative of increasing
                      stress in the Earth's crust.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visualization" className="mt-6">
            {signalData && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Signal Visualization</CardTitle>
                    <CardDescription>Visual representation of the uploaded seismic signal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SignalChart data={signalData} />
                  </CardContent>
                </Card>

                {features && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Extracted Features</CardTitle>
                      <CardDescription>Key statistical features extracted from the signal</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FeatureDisplay features={features} />
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => setActiveTab("prediction")} disabled={!prediction}>
                        View Prediction
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="prediction" className="mt-6">
            {prediction !== null && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Prediction Result</CardTitle>
                      <CardDescription>Estimated time to failure based on the seismic signal</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-rose-50 text-rose-700 hover:bg-rose-50">
                      Prediction
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <PredictionResult prediction={prediction} />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={resetData}>
                    Upload New Data
                  </Button>
                  <Button variant="secondary" onClick={() => setActiveTab("visualization")}>
                    Back to Visualization
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
