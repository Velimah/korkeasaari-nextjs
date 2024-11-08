import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { fetchFMIObservationData } from "@/utils/fetchFMIObservationData";

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

export async function POST(request: Request) {
  try {
    const { formattedDate, formattedStartDatePlusOne } = await request.json(); // Get the body content
    // Validate the date parameters
    if (!formattedDate || !formattedStartDatePlusOne) {
      return new Response(
        JSON.stringify({ error: "Missing startDate or endDate" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Fetch data
    const data = await fetchFMIObservationData(
      formattedDate,
      formattedStartDatePlusOne,
    );

    // Insert each entry into the database
    await sql`
        INSERT INTO weatherData (date, temperature, precipitation, cloudCover)
        VALUES (${data.time}, ${data.temperature}, ${data.precipitation}, ${data.cloudCover})
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
