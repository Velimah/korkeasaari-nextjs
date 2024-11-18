
import { Button } from "@/components/ui/button";
import { useState } from "react";
import UpdateVisitorPrediction from "@/utils/UpdateVisitorPrediction";
import { getBLOBData } from "@/hooks/fetchBLobData";
import { fetchFMIForecastData } from "@/hooks/fetchFMIForecastData";
import MLRCalculator from "@/utils/MLRCalculator";

export default function UpdatePredictionsToDatabase() {
    const [loading, setLoading] = useState(false);

    async function updateDatabase() {
        setLoading(true);
        const blobData = await getBLOBData();
        const weatherData = await fetchFMIForecastData();

        if (weatherData.length > 0 && Array.isArray(blobData) && blobData.length > 0) {
            const result = MLRCalculator({ weatherData, blobData });
            if (result) {
                await UpdateVisitorPrediction(result);
            }
        }
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