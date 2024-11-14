import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const jsonData = await sql`
      SELECT w.date AS date, 
        w.temperature, w.precipitation, w.cloudcover,
        v.kulkulupa, v.ilmaiskavijat, v.paasyliput, v.kampanjakavijat, v.verkkokauppa, v.vuosiliput
      FROM weatherdata w
      LEFT JOIN visitordata v ON w.date = v.date
      ORDER BY w.date ASC
      LIMIT 5000;
    `;

    return NextResponse.json(jsonData.rows, { status: 200 });
  } catch (error) {
    console.error("Error inserting visitor data:", error);
    return NextResponse.json(
      { error: "Failed to get visitor data" },
      { status: 500 },
    );
  }
}
