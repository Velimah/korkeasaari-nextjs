import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    noStore(); // Ensure this component is treated as a dynamic component
    const predictionData = await request.json();
    console.log("Prediction data received:", predictionData);

    // Validate incoming data
    if (
      !predictionData.date ||
      !predictionData.predictedDate ||
      predictionData.prediction == null ||
      predictionData.daysAhead == null
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Insert data into the predictions table
    await sql`
      INSERT INTO predictions (date, predicted_date, prediction, days_ahead)
      VALUES (${predictionData.date}, ${predictionData.predictedDate}, ${predictionData.prediction}, ${predictionData.daysAhead});
    `;

    return NextResponse.json(
      { response: "Data added successfully", predictionData },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error inserting prediction data:", error);
    return NextResponse.json(
      { error: "Failed to insert prediction data" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    noStore(); // Ensure this component is treated as a dynamic component
    // Fetch predictions and visitor data
    const predictionData = await sql`
      SELECT 
          v.date,
          MAX(CASE WHEN p.days_ahead = 1 THEN p.prediction END) AS day1prediction,
          MAX(CASE WHEN p.days_ahead = 2 THEN p.prediction END) AS day2prediction,
          MAX(CASE WHEN p.days_ahead = 3 THEN p.prediction END) AS day3prediction,
          MAX(CASE WHEN p.days_ahead = 4 THEN p.prediction END) AS day4prediction
      FROM 
          visitordata v
      LEFT JOIN 
          predictions p
      ON 
          v.date = p.predicted_date
      WHERE 
          v.date > '2024-11-11'
      GROUP BY 
          v.date 
      ORDER BY 
          v.date ASC;
    `;

    return NextResponse.json(predictionData.rows, {
      status: 200,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching prediction data:", error);
    return NextResponse.json(
      { error: "Failed to fetch prediction data" },
      { status: 500 },
    );
  }
}
