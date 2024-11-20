import { getMissingDates } from "./DateHelperFunctions";
import { fetchEnkoraData } from "@/hooks/fetchEnkoraVisitorData";
import processEnkoraVisitorData from "./EnkoraDataFormatter";

export default async function UpdateEnkoraDatabase() {
  const startDate = "2024-11-12"; //Database has all the data before this date
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);
  const currentDayMinusOne = endDate.toISOString().split("T")[0]; // Format it as YYYY-MM-DD

  if (startDate && currentDayMinusOne) {
    try {
      // Fetch all dates from database date column
      const response = await fetch(`/api/enkora-database`, {
        method: "GET", // Use GET method
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { visitorData } = await response.json();
      console.log("Visitor data from database:", visitorData);
      const existingDates = visitorData.rows.map((entry: { date: string }) => {
        return entry.date.split("T")[0];
      });

      // find all missing dates between startDate and currentDayMinusOne
      const missingDates = getMissingDates(
        startDate,
        currentDayMinusOne,
        existingDates,
      );
      console.log("Missing dates enkora:", missingDates);

      // Process missing dates sequentially to fetch from Enkora API
      for (const date of missingDates) {
        const data = await fetchEnkoraData(date);
        let result;
        if (data) {
          // Process the fetched data to calculate to change variable names and restructure the object by day
          result = processEnkoraVisitorData(data);
          // If result is an array and you want just the first object
          if (Array.isArray(result) && result.length > 0) {
            result = result[0]; // Use the first object in the array
          }
        }

        // Ensure that result is not undefined and is of the correct type
        if (result && "date" in result) {
          console.log("Sending Enkora visitor data to database:", result);

          // Send the processed visitor data to the database
          await fetch("/api/enkora-database", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              date: result.date,
              kulkulupa: result.kulkulupa,
              ilmaiskavijat: result.ilmaiskavijat,
              paasyliput: result.paasyliput,
              kampanjakavijat: result.kampanjakavijat,
              verkkokauppa: result.verkkokauppa,
              vuosiliput: result.vuosiliput,
            }),
          });
        }
      }
    } catch (error) {
      console.error("Error fetching visitor observation data:", error);
    }
  }
}
