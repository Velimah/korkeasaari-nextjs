import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(request: NextRequest) {
  noStore(); // Ensure this component is treated as a dynamic component
  try {
    const weatherData = await sql`
    SELECT date 
    FROM weatherdata 
    WHERE date > '2024-11-11'
    ORDER BY date ASC;
  `;

    return NextResponse.json({ weatherData }, { status: 200 });
  } catch (error) {
    console.error("Error inserting weather data:", error);
    return NextResponse.json(
      { error: "Failed to get weather data" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const weatherData = await request.json(); // Get the body content

    // Validate incoming data
    if (
      !weatherData.date ||
      weatherData.temperature == null ||
      weatherData.precipitation == null ||
      weatherData.cloudcover == null
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Insert each entry into the database
    await sql`
        INSERT INTO weatherdata (date, temperature, precipitation, cloudcover)
        VALUES (${weatherData.date}, ${weatherData.temperature}, ${weatherData.precipitation}, ${weatherData.cloudcover})
        ON CONFLICT (date) DO NOTHING;
      `;

    return NextResponse.json({ response: "data added" }, { status: 200 });
  } catch (error) {
    console.error("Error inserting weather data:", error);
    return NextResponse.json(
      { error: "Failed to insert weather data" },
      { status: 500 },
    );
  }
}
