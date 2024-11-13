import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const weatherData =
      await sql`SELECT date FROM weatherdata ORDER BY date ASC;`;

    return NextResponse.json({ weatherData }, { status: 200 });
  } catch (error) {
    console.error("Error inserting weather data:", error);
    return NextResponse.json(
      { error: "Failed to get weather data" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const weatherData = await request.json(); // Get the body content

    // Insert each entry into the database
    await sql`
        INSERT INTO weatherdata (date, temperature, precipitation, cloudCover)
        VALUES (${weatherData.date}, ${weatherData.temperature}, ${weatherData.precipitation}, ${weatherData.cloudCover})
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
