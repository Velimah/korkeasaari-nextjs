import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { BLOB } from "@/hooks/fetchBLobData";

export async function PUT(request: NextRequest) {
  try {
    // Step 1: Fetch the existing data from the blob
    const response = await fetch(
      "https://yxkilu3yp1tkxpeo.public.blob.vercel-storage.com/data/mydata.json",
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the existing data (ensure the response is in JSON format)
    const existingData: BLOB[] = await response.json();

    // Step 2: Parse the new data from the request body
    const newData: BLOB[] = await request.json();

    // Step 3: Combine the data while removing duplicates based on the 'date' field
    const existingDates = new Set(
      existingData.map((data: { date: string }) => data.date),
    );

    // Filter out any new data that already exists in the existing data
    const filteredNewData = newData.filter(
      (data: { date: string }) => !existingDates.has(data.date),
    );

    // Combine the existing data with the filtered new data
    const updatedData: BLOB[] = [...existingData, ...filteredNewData];

    // Step 4: Convert the updated data back to JSON string
    const jsonString = JSON.stringify(updatedData);

    // Step 5: Upload the updated data to Vercel Blob
    const { url } = await put("data/mydata.json", jsonString, {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });

    // Step 6: Return the URL as a JSON response
    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload data" },
      { status: 500 },
    );
  }
}
