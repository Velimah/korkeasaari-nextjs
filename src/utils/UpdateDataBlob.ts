export default async function UpdateDataBlob() {
  try {
    // Fetch all Enkora and FMI data from database API
    const response = await fetch("/api/database", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Send the fetched data to the Blob API as JSON
    const response2 = await fetch(`/api/blob`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response2.ok) {
      throw new Error(`Blob upload failed! status: ${response2.status}`);
    }

    const { url } = await response2.json();
    console.log("Blob data uploaded to:", url);
  } catch (error) {
    console.error("Error fetching and uploading data:", error);
  }
}
