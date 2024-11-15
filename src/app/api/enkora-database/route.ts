import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
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
