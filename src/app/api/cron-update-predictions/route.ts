import { getBLOBData } from "@/hooks/fetchBLobData";
import { fetchFMIForecastData } from "@/hooks/fetchFMIForecastData";
import { NextRequest, NextResponse } from "next/server";
import { getDaysAhead } from "@/utils/DateHelperFunctions";
import { sql } from "@vercel/postgres";
import MLRCalculator from "@/utils/MLRCalculator";

export const fetchCache = "force-no-store";

export async function GET(request: NextRequest) {
  try {
    const blobData = await getBLOBData();
    const weatherData = await fetchFMIForecastData();

    // Validate incoming data
    if (
      !Array.isArray(blobData) ||
      blobData.length < 1 ||
      weatherData.length < 1
    ) {
      return NextResponse.json(
        { error: "Missing blobdata or weatherdata" },
        { status: 400 },
      );
    }

    const predictions = MLRCalculator({ weatherData, blobData });

    if (!predictions || !Array.isArray(predictions)) {
      return NextResponse.json(
        { error: "Invalid predictions format" },
        { status: 500 },
      );
    }

    const todayDate = new Date().toISOString().split("T")[0];
    const result = predictions.slice(1, 5);
    const responses = [];

    for (const entry of result) {
      const { date, predictedvisitors } = entry;

      if (!date || predictedvisitors == null) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 },
        );
      }

      const daysAhead = getDaysAhead(date);
      const dataToSend = {
        date: todayDate, // Today's date
        predictedDate: date, // predicted date
        prediction: predictedvisitors,
        daysAhead, // predicted days ahead
      };

      try {
        // Insert into database
        await sql`
          INSERT INTO predictions (date, predicted_date, prediction, days_ahead)
          VALUES (${dataToSend.date}, ${dataToSend.predictedDate}, ${dataToSend.prediction}, ${dataToSend.daysAhead});
        `;
        responses.push({ date, status: "success" });
      } catch (dbError) {
        console.error("Database insertion error:", dbError);
        const errorMessage =
          dbError instanceof Error ? dbError.message : "Unknown error";
        responses.push({ date, status: "failure", error: errorMessage });
      }
    }

    return NextResponse.json({ responses }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to upload data", details: errorMessage },
      { status: 500 },
    );
  }
}
