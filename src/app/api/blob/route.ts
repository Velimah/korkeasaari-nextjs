import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    // Parse the JSON body from the request
    const jsonData = await request.json();

    const jsonString = JSON.stringify(jsonData);

    // Upload to Vercel Blob
    const { url } = await put("data/mydata.json", jsonString, {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });

    // Return the URL as a JSON response
    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload data" },
      { status: 500 },
    );
  }
}
