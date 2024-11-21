import { fetchFMIObservationData } from "@/hooks/fetchFMIObservationData";
import processFMIWeatherData from "@/utils/FMIdataFormatter";
import { getMissingDates } from "@/utils/DateHelperFunctions";

// Define the WeatherData component
export default async function UpdateFMIDatabase() {
  const startDate = "2024-11-12"; //Database has all the data before this date
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);
  const currentDayMinusOne = endDate.toISOString().split("T")[0]; // Format it as YYYY-MM-DD
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // Default to localhost

  if (startDate && currentDayMinusOne) {
    try {
      // Fetch all dates from database date column
      const response = await fetch(`${apiUrl}/api/fmi-database`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { weatherData } = await response.json();
      console.log("weatherData from database:", weatherData);
      const existingDates = weatherData.rows.map((entry: { date: string }) => {
        return entry.date.split("T")[0];
      });

      // find all missing dates between startDate and currentDayMinusOne
      const missingDates = getMissingDates(
        startDate,
        currentDayMinusOne,
        existingDates,
      );
      console.log("Missing dates fmi:", missingDates);

      if (missingDates.length === 0) {
        console.log("No missing dates found, exiting...");
        return true;
      }

      // Process missing dates sequentially and add timestamps to fetch from FMI API
      for (const date of missingDates) {
        const formattedStartTime = `${date}T00:00:00Z`;
        const formattedEndTime = `${date}T23:00:00Z`;

        const fmiWeatherData = await fetchFMIObservationData(
          formattedStartTime,
          formattedEndTime,
        );

        // Process the fetched data to calculate mean and sum values between 10-20
        const proceccedFMIWeatherData = processFMIWeatherData(fmiWeatherData);
        console.log(
          "Sending FMI weather data to database:",
          proceccedFMIWeatherData,
        );

        // Send the processed weather data to the database
        await fetch(`${apiUrl}/api/enkora-database`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: proceccedFMIWeatherData.date,
            temperature: proceccedFMIWeatherData.temperature,
            cloudcover: proceccedFMIWeatherData.cloudcover,
            precipitation: proceccedFMIWeatherData.precipitation,
          }),
        });
      }
      return false;
    } catch (error) {
      console.error("Error fetching weather observation data:", error);
    }
  }
}
