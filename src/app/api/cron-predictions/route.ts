import { UpdateVisitorPrediction } from "@/hooks/UpdateVisitorPrediction";
import { getBLOBData } from "@/hooks/fetchBLobData";
import { fetchFMIForecastData } from "@/hooks/fetchFMIForecastData";
import MLRCalculator from "@/utils/MLRCalculator";
import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore } from "next/cache";

export async function GET(request: NextRequest) {
  unstable_noStore(); // Ensure this component is treated as a dynamic component
  try {
    const blobData = await getBLOBData();
    const weatherData = await fetchFMIForecastData();

    if (
      weatherData.length > 0 &&
      Array.isArray(blobData) &&
      blobData.length > 0
    ) {
      const result = MLRCalculator({ weatherData, blobData });
      if (result) {
        await UpdateVisitorPrediction(result);
      }
    }

    return NextResponse.json({ response: "data updated" }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload data" },
      { status: 500 },
    );
  }
}
