import { getDaysAhead } from "@/utils/DateHelperFunctions";
import { unstable_noStore } from "next/cache";
interface PredictionEntry {
  date: string;
  predictedvisitors: number;
}

interface PredictionData {
  date: string;
  day1prediction: number;
  day2prediction: number;
  day3prediction: number;
  day4prediction: number;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // Default to localhost
export async function UpdateVisitorPrediction(predictions: PredictionEntry[]) {
  unstable_noStore(); // Ensure this component is treated as a dynamic component
  // Process only the day 2-5 predictions
  const result = predictions.slice(1, 5);
  console.log("Predictions to be saved:", result);

  try {
    for (const entry of result) {
      const { date, predictedvisitors } = entry;

      // Calculate days ahead
      const daysAhead = getDaysAhead(date);

      const dataToSend = {
        date: new Date().toISOString().split("T")[0], // Today's date (day of prediction)
        predictedDate: date, // Future date being predicted
        prediction: predictedvisitors,
        daysAhead: daysAhead,
      };

      // Send the prediction data to the API
      await fetch(`${apiUrl}/api/predictions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
    }
  } catch (error) {
    console.error("Error saving prediction data:", error);
  }
}

export async function getVisitorPredictions(): Promise<
  PredictionData[] | { error: string }
> {
  unstable_noStore(); // Ensure this component is treated as a dynamic component
  try {
    const response = await fetch(`${apiUrl}/api/predictions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching prediction data:", error);
    return { error: "Error fetching prediction data" };
  }
}
