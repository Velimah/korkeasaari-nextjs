import { put } from "@vercel/blob";

export async function PUT(request: Request) {
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
    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Upload error:", error); // Log the error for easier debugging
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
