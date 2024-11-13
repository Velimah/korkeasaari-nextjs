import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const visitorData =
      await sql`SELECT date FROM visitordata ORDER BY date ASC;`;

    return NextResponse.json({ visitorData }, { status: 200 });
  } catch (error) {
    console.error("Error inserting visitor data:", error);
    return NextResponse.json(
      { error: "Failed to get visitor data" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const visitorData = await request.json(); // Get the body content

    await sql`
      INSERT INTO visitordata (date, kulkulupa, ilmaiskavijat, paasyliput, verkkokauppa, vuosiliput)
      VALUES (${visitorData.date}, ${visitorData.kulkulupa}, ${visitorData.ilmaiskavijat}, ${visitorData.paasyliput}, ${visitorData.verkkokauppa}, ${visitorData.vuosiliput})
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
