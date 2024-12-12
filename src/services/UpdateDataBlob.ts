import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export default async function UpdateDataBlob() {
  let jsonData;

  try {
    // Fetch data from the database
    jsonData = await sql`
      SELECT 
        w.date AS date, 
        w.temperature, 
        w.precipitation, 
        w.cloudcover,
        v.kulkulupa, 
        v.ilmaiskavijat, 
        v.paasyliput, 
        v.kampanjakavijat, 
        v.verkkokauppa, 
        v.vuosiliput,
        (COALESCE(v.ilmaiskavijat, 0) + 
        COALESCE(v.paasyliput, 0) + 
        COALESCE(v.kampanjakavijat, 0) + 
        COALESCE(v.verkkokauppa, 0) + 
        COALESCE(v.vuosiliput, 0)) AS totalvisitors
      FROM 
        weatherdata w
      LEFT JOIN 
        visitordata v 
      ON 
        w.date = v.date
      WHERE 
        w.date > '2024-12-10'
      ORDER BY 
        w.date ASC
      LIMIT 5000;
    `;
  } catch (dbError) {
    console.error("Database query failed:", dbError);
    return {
      success: false,
      message: "Database query failed.",
    };
  }

  try {
    // Fetch existing data from the blob
    const response = await fetch(
      "https://yxkilu3yp1tkxpeo.public.blob.vercel-storage.com/data/mydata.json",
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch existing data: HTTP ${response.status}`);
    }

    const existingData = await response.json();

    // Validate existing data structure
    if (!Array.isArray(existingData)) {
      throw new Error("Existing data is not an array");
    }

    // Parse new data
    const newData = jsonData.rows.map((row) => ({
      date: row.date,
      temperature: row.temperature,
      precipitation: row.precipitation,
      cloudcover: row.cloudcover,
      kulkulupa: row.kulkulupa,
      ilmaiskavijat: row.ilmaiskavijat,
      paasyliput: row.paasyliput,
      kampanjakavijat: row.kampanjakavijat,
      verkkokauppa: row.verkkokauppa,
      vuosiliput: row.vuosiliput,
      totalvisitors: row.totalvisitors,
    }));

    // Combine data, removing duplicates based on the 'date' field
    const existingDates = new Set(existingData.map((data) => data.date));
    const filteredNewData = newData.filter(
      (data) => !existingDates.has(data.date),
    );
    const updatedData = [...existingData, ...filteredNewData];

    // Convert updated data to JSON
    const jsonString = JSON.stringify(updatedData);

    // Upload updated data to the blob
    const { url } = await put("data/mydata.json", jsonString, {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });

    return NextResponse.json({ url }, { status: 200 });
  } catch (uploadError) {
    console.error("Upload failed:", uploadError);
    return NextResponse.json(
      { error: "Failed to upload updated data" },
      { status: 500 },
    );
  }
}
