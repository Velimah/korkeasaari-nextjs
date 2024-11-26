interface PredictionData {
  date: string;
  day1prediction: number;
  day2prediction: number;
  day3prediction: number;
  day4prediction: number;
}

export async function getVisitorPredictions(): Promise<
  PredictionData[] | { error: string }
> {
  try {
    const response = await fetch(`/api/get-predictions`, {
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
