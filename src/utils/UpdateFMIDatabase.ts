import { fetchFMIObservationData } from "@/hooks/fetchFMIObservationData";
import processFMIWeatherData from "@/utils/FMIdataFormatter";
import { getMissingDates } from "@/utils/findMissingDates";

// Define the WeatherData component
export default async function UpdateFMIDatabase() {
  const startDate = "2024-11-01";
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);
  const currentDayMinusOne = endDate.toISOString().split("T")[0]; // Format it as YYYY-MM-DD

  if (startDate && currentDayMinusOne) {
    try {
      // Fetch all dates that are in the database
      const response = await fetch(`/api/fmi-database`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { weatherData } = await response.json();
      const existingDates = weatherData.rows.map((entry: { date: string }) => {
        return entry.date.split("T")[0];
      });

      // find all missing dates between startDate and currentDayMinusOne
      const missingDates = getMissingDates(
        startDate,
        currentDayMinusOne,
        existingDates,
      );

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
        await fetch("/api/fmi-database", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: proceccedFMIWeatherData.date,
            temperature: proceccedFMIWeatherData.temperature,
            cloudCover: proceccedFMIWeatherData.cloudCover,
            precipitation: proceccedFMIWeatherData.precipitation,
          }),
        });
      }
    } catch (error) {
      console.error("Error fetching weather observation data:", error);
    }
  }
}