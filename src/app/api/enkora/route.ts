export async function POST(request: Request) {
  try {
    const { startDate, endDate } = await request.json();
    if (!startDate || !endDate) {
      return new Response(
        JSON.stringify({ error: "Missing startDate or endDate" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const url = "https://oma.enkora.fi/korkeasaari/reports/validations/json";
    const params = new URLSearchParams({
      input_format: "post_data",
      authentication: `${process.env.ENKORA_USER},${process.env.ENKORA_PASS}`,
      clear_values: "1",
      "values[timestamp]": `${startDate}--${endDate}`,
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

    return new Response(JSON.stringify(jsonData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
