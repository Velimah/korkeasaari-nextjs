import { getMissingDates } from "./DateHelperFunctions";
import processEnkoraVisitorData from "./EnkoraDataFormatter";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export default async function UpdateEnkoraDatabase() {
  const startDate = "2024-11-12"; // Database has all data before this date
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1); // Exclude today
  const currentDayMinusOne = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

  try {
    // Fetch existing dates from the database
    const existingData = await sql`
      SELECT date 
      FROM visitordata 
      WHERE date > '2024-11-11'
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
    console.log("Missing dates for Enkora update:", missingDates);

    if (missingDates.length === 0) {
      console.log("No missing dates found. Exiting...");
      return NextResponse.json(
        { message: "No missing dates to update." },
        { status: 200 },
      );
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
          continue; // Skip to the next date
        }

        const jsonData = await response.json();

        if (!jsonData) {
          console.error(`No data returned for ${date}`);
          continue;
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
          continue; // Skip invalid data
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
        // Continue processing other dates despite errors
      }
    }

    return NextResponse.json(
      { message: "Missing dates updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Critical error during database update:", error);
    return NextResponse.json(
      { error: "Failed to update Enkora data." },
      { status: 500 },
    );
  }
}
