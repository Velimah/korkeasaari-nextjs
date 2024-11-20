interface EnkoraVisitorData {
  validations: {
    rows: VisitorDataRow[];
  };
}

interface VisitorDataRow {
  day: string;
  service_group_id: string;
  quantity: string;
  unique_accounts_quantity: string;
}

export const fetchEnkoraData = async (date: string) => {
  try {
    const response = await fetch("/api/enkora", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date,
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
};
