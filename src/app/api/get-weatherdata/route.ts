import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const weatherData =
      await sql`SELECT date FROM weatherData ORDER BY date ASC;`;

    return NextResponse.json({ weatherData }, { status: 200 });
  } catch (error) {
    console.error("Error inserting weather data:", error);
    return NextResponse.json(
      { error: "Failed to get weather data" },
      { status: 500 },
    );
  }
}
