import { processEnkoraVisitorData } from "./EnkoraDataFormatter";

interface VisitorDataRow {
  day: string;
  service_group_id: string;
  quantity: string;
  unique_accounts_quantity: string;
}

interface EnkoraVisitorData {
  validations: {
    rows: VisitorDataRow[];
  };
}

export const fetchEnkoraData = async (startDate: string, endDate: string) => {
  if (startDate && endDate) {
    // Only fetch if both dates are provided
    try {
      const response = await fetch("/api/enkora", {
        method: "POST", // Use POST method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate, // Send start date
          endDate, // Send end date
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EnkoraVisitorData = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching visitor data:", error);
    }
  }
};
