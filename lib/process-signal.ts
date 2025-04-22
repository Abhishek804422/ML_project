/**
 * Process the uploaded CSV file containing seismic signal data
 */
export async function processSignalData(file: File): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("Failed to read file")
        }

        const csvContent = event.target.result as string
        const lines = csvContent.split(/\r\n|\n/).filter((line) => line.trim() !== "")

        // Check if the file has a header
        const hasHeader = isNaN(Number.parseFloat(lines[0].split(",")[0]))
        const startIndex = hasHeader ? 1 : 0

        // Parse the signal values
        const signalData = lines.slice(startIndex).map((line) => {
          const values = line.split(",")
          // Take the first column if there are multiple columns
          return Number.parseFloat(values[0])
        })

        // Validate the data
        if (signalData.some(isNaN)) {
          throw new Error("Invalid data format: File contains non-numeric values")
        }

        if (signalData.length === 0) {
          throw new Error("Empty data: No valid signal values found")
        }

        resolve(signalData)
      } catch (error) {
        reject(error instanceof Error ? error : new Error("Failed to process file"))
      }
    }

    reader.onerror = () => {
      reject(new Error("Error reading file"))
    }

    reader.readAsText(file)
  })
}
