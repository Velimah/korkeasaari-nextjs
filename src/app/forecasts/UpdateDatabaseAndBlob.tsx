
import { Button } from "@/components/ui/button";
import UpdateDataBlob from "@/utils/UpdateDataBlob";
import UpdateEnkoraDatabase from "@/utils/UpdateEnkoraDatabase";
import UpdateFMIDatabase from "@/utils/UpdateFMIDatabase";
import { useState } from "react";

export default function UpdateDatabaseAndBlob() {
  const [loading, setLoading] = useState(false);

  async function updateDatabase() {
    setLoading(true);
    await UpdateFMIDatabase();
    await UpdateEnkoraDatabase();
    await UpdateDataBlob();
    setLoading(false);
  };

  return (
    <div className="p-6 flex w-full justify-center items-center">
      <Button
        className={`w-48 p-2 m-2 ${loading ? 'bg-red-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
        onClick={updateDatabase}
        disabled={loading} // Optionally disable the button to prevent multiple clicks
      >
        {loading ? "Updating..." : "Update Database"}
      </Button>
    </div>
  );
}