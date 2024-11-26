import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore } from "next/cache";
import { fetchFMIObservationData } from "@/hooks/fetchFMIObservationData";
import processFMIWeatherData from "@/utils/FMIdataFormatter";
import { getMissingDates } from "@/utils/DateHelperFunctions";

export default async function UpdateFMIDatabase() {
  unstable_noStore(); // Ensure the response is not cached

  const startDate = "2024-11-12"; // Database has all the data before this date
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);
  const currentDayMinusOne = endDate.toISOString().split("T")[0];

  try {
    // Fetch all existing dates from the database
    const existingData = await sql`
      SELECT date 
      FROM weatherdata 
      WHERE date > '2024-11-11'
      ORDER BY date ASC;
    `;
    const existingDates = existingData.rows.map(
      (entry) => entry.date.split("T")[0],
    );

    // Identify missing dates
    const missingDates = getMissingDates(
      startDate,
      currentDayMinusOne,
      existingDates,
    );
    if (missingDates.length === 0) {
      console.log("No missing dates found, exiting...");
      return NextResponse.json(
        { message: "No missing dates." },
        { status: 200 },
      );
    }

    // Process and insert data for missing dates
    for (const date of missingDates) {
      const formattedStartTime = `${date}T00:00:00Z`;
      const formattedEndTime = `${date}T23:00:00Z`;

      // Fetch weather data from FMI API
      const fmiWeatherData = await fetchFMIObservationData(
        formattedStartTime,
        formattedEndTime,
      );

      // Process the fetched data
      const processedData = processFMIWeatherData(fmiWeatherData);
      console.log("Processed FMI weather data:", processedData);

      // Insert processed data into the database
      await sql`
        INSERT INTO weatherdata (date, temperature, precipitation, cloudcover)
        VALUES (${processedData.date}, ${processedData.temperature}, ${processedData.precipitation}, ${processedData.cloudcover})
        ON CONFLICT (date) DO NOTHING;
      `;
    }

    return NextResponse.json(
      { message: "Missing dates updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating weather data:", error);
    return NextResponse.json(
      { error: "Failed to update weather data." },
      { status: 500 },
    );
  }
}
