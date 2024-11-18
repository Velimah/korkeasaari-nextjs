import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(request: NextRequest) {
  try {
    noStore(); // Ensure this component is treated as a dynamic component
    const visitorData = await sql`
    SELECT date 
    FROM visitordata 
    WHERE date > '2024-11-11'
    ORDER BY date ASC;
  `;

    return NextResponse.json({ visitorData }, { status: 200 });
  } catch (error) {
    console.error("Error inserting visitor data:", error);
    return NextResponse.json(
      { error: "Failed to get visitor data" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const visitorData = await request.json(); // Get the body content

    // Validate incoming data
    if (
      !visitorData.date ||
      visitorData.kulkulupa == null ||
      visitorData.ilmaiskavijat == null ||
      visitorData.paasyliput == null ||
      visitorData.kampanjakavijat == null ||
      visitorData.verkkokauppa == null ||
      visitorData.vuosiliput == null
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await sql`
      INSERT INTO visitordata (date, kulkulupa, ilmaiskavijat, paasyliput, kampanjakavijat, verkkokauppa, vuosiliput)
      VALUES (${visitorData.date}, ${visitorData.kulkulupa}, ${visitorData.ilmaiskavijat}, ${visitorData.paasyliput}, ${visitorData.kampanjakavijat}, ${visitorData.verkkokauppa}, ${visitorData.vuosiliput})
      ON CONFLICT (date) DO NOTHING;
    `;

    return NextResponse.json({ response: "data added" }, { status: 200 });
  } catch (error) {
    console.error("Error inserting visitor data:", error);
    return NextResponse.json(
      { error: "Failed to insert visitor data" },
      { status: 500 },
    );
  }
}
