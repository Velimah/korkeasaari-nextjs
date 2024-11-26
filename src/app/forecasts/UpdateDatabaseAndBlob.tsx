import { Button } from "@/components/ui/button";
import { useState } from "react";

export function UpdateDatabaseAndBlob() {
  const [loading, setLoading] = useState(false);

  const updateDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cron-fmienkora", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("db", data);
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setLoading(false);
    };

  }
  return (
    <div className="flex justify-center items-center">
      <Button
        className={`w-48 p-2 m-2 ${loading
          ? "bg-red-600 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600"
          }`}
        onClick={updateDatabase}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Database"}
      </Button>
    </div>
  );
}

export default UpdateDatabaseAndBlob;