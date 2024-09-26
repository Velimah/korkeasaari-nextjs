import { fetchEnkoraData } from '@/utils/fetchEnkoraData';

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

