export async function POST(request: Request) {
  try {
      const { startDate, endDate } = await request.json(); // Get the body content
      // Validate the date parameters
      if (!startDate || !endDate) {
          return new Response(JSON.stringify({ error: "Missing startDate or endDate" }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
          });
      }

      // Call the fetch function with the provided dates
      const data = await fetchEnkoraData(startDate, endDate);
      return new Response(JSON.stringify(data), { // Return the data as JSON
          status: 200,
          headers: { 'Content-Type': 'application/json' },
      });
  } catch (error) {
      if (error instanceof Error) {
          return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
          });
      } else {
          return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
          });
      }
  }
}

const fetchEnkoraData = async (startDate: string, endDate: string) => {
  const url = "https://oma.enkora.fi/korkeasaari/reports/validations/json";
  const data = new URLSearchParams({
    input_format: "post_data",
    authentication: `${process.env.ENKORA_USER},${process.env.ENKORA_PASS}`,
    clear_values: "1",
    "values[timestamp]": `${startDate}--${endDate}`,  // Use dynamic date range
    "values[group-0]": "day",
    "values[group-1]": "service_group_id"
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json(); // Parse response as JSON
    return jsonData; // Return the fetched JSON data
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      throw error; // Rethrow the error to handle it later
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};

