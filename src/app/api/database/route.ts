import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const jsonData = await sql`
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
      w.date > '2024-11-11'
    ORDER BY 
        w.date ASC
    LIMIT 500;
    `;

    return NextResponse.json(jsonData.rows, {
      status: 200,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Error inserting visitor data:", error);
    return NextResponse.json(
      { error: "Failed to get visitor data" },
      { status: 500 },
    );
  }
}
