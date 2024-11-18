import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { date } = await request.json();
    if (!date) {
      return NextResponse.json(
        { error: "Missing startDate or endDate" },
        { status: 400 },
      );
    }

    const url = "https://oma.enkora.fi/korkeasaari/reports/validations/json";
    const params = new URLSearchParams({
      input_format: "post_data",
      authentication: `${process.env.ENKORA_USER},${process.env.ENKORA_PASS}`,
      clear_values: "1",
      "values[timestamp]": `${date}`,
      "values[group-0]": "day",
      "values[group-1]": "service_group_id",
    });

    const response = await fetch(url, {
      method: "POST",
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();

    return NextResponse.json(jsonData, { status: 200 });
  } catch (error) {
    console.error("Error fetching Enkora data:", error);
    return NextResponse.json(
      { error: "Failed to get visitor data" },
      { status: 500 },
    );
  }
}
