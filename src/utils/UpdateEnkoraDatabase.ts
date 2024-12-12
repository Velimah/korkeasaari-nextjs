import { getMissingDates } from "./DateHelperFunctions";
import processEnkoraVisitorData from "./EnkoraDataFormatter";
import { sql } from "@vercel/postgres";

export default async function UpdateEnkoraDatabase() {
  const startDate = "2024-12-10"; // Database has all data before this date
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1); // Exclude today
  const currentDayMinusOne = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

  try {
    // Fetch existing dates from the database
    const existingData = await sql`
      SELECT date 
      FROM visitordata 
      WHERE date > '2024-12-10'
      ORDER BY date ASC;
    `;

    const existingDates = existingData.rows.map(
      (entry) => entry.date.split("T")[0],
    );

    // Find missing dates
    const missingDates = getMissingDates(
      startDate,
      currentDayMinusOne,
      existingDates,
    );

    if (missingDates.length === 0) {
      console.log("No missing dates found. Exiting...");
      return { success: false, message: "No missing Enkora dates to update." };
    }

    // Process missing dates sequentially
    for (const date of missingDates) {
      try {
        const url =
          "https://oma.enkora.fi/korkeasaari/reports/validations/json";
        const params = new URLSearchParams({
          input_format: "post_data",
          authentication: `${process.env.ENKORA_USER},${process.env.ENKORA_PASS}`,
          clear_values: "1",
          "values[timestamp]": date,
          "values[group-0]": "day",
          "values[group-1]": "service_group_id",
        });

        const response = await fetch(url, {
          method: "POST",
          body: params,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        if (!response.ok) {
          console.error(
            `Failed to fetch data for ${date}. Status: ${response.status}`,
          );
          return { success: false, message: "Failed to fetch visitor data." };
        }

        const jsonData = await response.json();

        if (!jsonData) {
          console.error(`No data returned for ${date}`);
          return { success: false, message: "No visitor data received." };
        }

        // Process and validate the fetched data
        const results = processEnkoraVisitorData(jsonData);
        const result = results[0]; // Get the first result from the array

        if (
          !result ||
          !result.date ||
          result.kulkulupa == null ||
          result.ilmaiskavijat == null ||
          result.paasyliput == null ||
          result.kampanjakavijat == null ||
          result.verkkokauppa == null ||
          result.vuosiliput == null
        ) {
          console.error(`Invalid data for ${date}:`, result);
          return { success: false, message: "Invalid visitor data." };
        }

        console.log("Inserting data into database:", result);

        // Insert data into the database
        await sql`
          INSERT INTO visitordata 
          (date, kulkulupa, ilmaiskavijat, paasyliput, kampanjakavijat, verkkokauppa, vuosiliput)
          VALUES 
          (${result.date}, ${result.kulkulupa}, ${result.ilmaiskavijat}, ${result.paasyliput}, ${result.kampanjakavijat}, ${result.verkkokauppa}, ${result.vuosiliput})
          ON CONFLICT (date) DO NOTHING;
        `;
      } catch (error) {
        console.error(`Error processing date ${date}:`, error);
        return {
          success: false,
          message: "Error inserting visitor data to database.",
        };
      }
    }

    return {
      success: true,
      message: "Visitor data updated to database.",
    };
  } catch (error) {
    console.error("Critical error during database update:", error);
    return {
      success: false,
      message: "Error inserting visitor data to database",
    };
  }
}
