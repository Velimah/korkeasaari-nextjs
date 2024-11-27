import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export const fetchCache = "force-no-store";

export async function GET(request: NextRequest) {
  try {
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
          v.date > '2024-11-18'
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
