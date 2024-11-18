interface PredictionEntry {
  date: string;
  predictedvisitors: number;
}

export default async function UpdateVisitorPrediction(
  predictions: PredictionEntry[],
) {
  // Process only the first 2-5 predictions
  const result = predictions.slice(1, 5);

  try {
    for (const entry of result) {
      const { date, predictedvisitors } = entry;

      // Calculate days ahead
      const daysAhead = getDaysAhead(date);

      // Send the prediction data to the API
      await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: date, // Prediction date
          predictedDate: new Date().toISOString().split("T")[0], // Today's date
          prediction: predictedvisitors,
          daysAhead: daysAhead,
        }),
      });
    }
  } catch (error) {
    console.error("Error saving prediction data:", error);
  }

  // Helper function to calculate days ahead
  function getDaysAhead(targetDate: string): number {
    const target = new Date(targetDate);
    const today = new Date();

    // Clear time components for an accurate day difference
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  }
}
