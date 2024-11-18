import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const predictionData = await request.json();

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
      { response: "Data added successfully" },
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
    // Fetch predictions and visitor data
    const predictionData = await sql`
      SELECT 
        v.date AS date,
        v.visitorcount,
        MAX(CASE WHEN p.days_ahead = 1 THEN p.prediction END) AS day1,
        MAX(CASE WHEN p.days_ahead = 2 THEN p.prediction END) AS day2,
        MAX(CASE WHEN p.days_ahead = 3 THEN p.prediction END) AS day3,
        MAX(CASE WHEN p.days_ahead = 4 THEN p.prediction END) AS day4,
        MAX(CASE WHEN p.days_ahead = 5 THEN p.prediction END) AS day5
      FROM 
        visitordata v
      LEFT JOIN 
        predictions p
      ON 
        v.date = p.date
      GROUP BY 
        v.date, v.visitorcount
      ORDER BY 
        v.date ASC;
    `;

    return NextResponse.json({ predictionData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching prediction data:", error);
    return NextResponse.json(
      { error: "Failed to fetch prediction data" },
      { status: 500 },
    );
  }
}
