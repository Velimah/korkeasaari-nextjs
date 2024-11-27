import { sql } from "@vercel/postgres";
import { fetchFMIObservationData } from "@/hooks/fetchFMIObservationData";
import processFMIWeatherData from "@/utils/FMIdataFormatter";
import { getMissingDates } from "@/utils/DateHelperFunctions";

export default async function UpdateFMIDatabase() {
  const startDate = "2024-11-21"; // Database has all the data before this date
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);
  const currentDayMinusOne = endDate.toISOString().split("T")[0];

  try {
    // Fetch all existing dates from the database
    const existingData = await sql`
      SELECT date 
      FROM weatherdata 
      WHERE date > '2024-11-20'
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
      return { success: false, message: "No missing FMI dates to update." };
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

    return { success: true, message: "Weather data updated to database." };
  } catch (error) {
    console.error("Error updating weather data:", error);
    return {
      success: false,
      message: "Error updating weather data to database",
    };
  }
}
