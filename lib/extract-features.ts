/**
 * Extract statistical features from the seismic signal
 */
export function extractFeatures(signal: number[]): Record<string, number> {
  // Calculate basic statistics
  const mean = calculateMean(signal)
  const std = calculateStandardDeviation(signal, mean)
  const max = Math.max(...signal)
  const min = Math.min(...signal)
  const median = calculateMedian(signal)

  // Calculate energy (sum of squared values)
  const energy = signal.reduce((sum, value) => sum + value * value, 0)

  // Calculate quantiles
  const q25 = calculatePercentile(signal, 25)
  const q75 = calculatePercentile(signal, 75)
  const iqr = q75 - q25

  // Calculate skewness and kurtosis
  const skewness = calculateSkewness(signal, mean, std)
  const kurtosis = calculateKurtosis(signal, mean, std)

  return {
    mean,
    std,
    max,
    min,
    median,
    energy,
    q25,
    q75,
    iqr,
    skewness,
    kurtosis,
  }
}

// Helper functions for statistical calculations
function calculateMean(data: number[]): number {
  return data.reduce((sum, value) => sum + value, 0) / data.length
}

function calculateStandardDeviation(data: number[], mean: number): number {
  const squaredDifferences = data.map((value) => Math.pow(value - mean, 2))
  const variance = squaredDifferences.reduce((sum, value) => sum + value, 0) / data.length
  return Math.sqrt(variance)
}

function calculateMedian(data: number[]): number {
  const sortedData = [...data].sort((a, b) => a - b)
  const midIndex = Math.floor(sortedData.length / 2)

  if (sortedData.length % 2 === 0) {
    return (sortedData[midIndex - 1] + sortedData[midIndex]) / 2
  } else {
    return sortedData[midIndex]
  }
}

function calculatePercentile(data: number[], percentile: number): number {
  const sortedData = [...data].sort((a, b) => a - b)
  const index = (percentile / 100) * (sortedData.length - 1)
  const lowerIndex = Math.floor(index)
  const upperIndex = Math.ceil(index)

  if (lowerIndex === upperIndex) {
    return sortedData[lowerIndex]
  }

  const weight = index - lowerIndex
  return sortedData[lowerIndex] * (1 - weight) + sortedData[upperIndex] * weight
}

function calculateSkewness(data: number[], mean: number, std: number): number {
  if (std === 0) return 0

  const cubedDifferences = data.map((value) => Math.pow((value - mean) / std, 3))
  return cubedDifferences.reduce((sum, value) => sum + value, 0) / data.length
}

function calculateKurtosis(data: number[], mean: number, std: number): number {
  if (std === 0) return 0

  const fourthPowerDifferences = data.map((value) => Math.pow((value - mean) / std, 4))
  return fourthPowerDifferences.reduce((sum, value) => sum + value, 0) / data.length
}
