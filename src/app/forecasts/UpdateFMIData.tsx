"use client";
import { Button } from "@/components/ui/button";
import { fetchFMIObservationData } from "@/utils/fetchFMIObservationData";
import { processWeatherObservationData } from "@/utils/FMIdataFormatter";

// Define the WeatherData component
export default function UpdateFMIData() {

    const startDate = '2024-10-01';
    const endDate = '2024-10-03';
    async function fetchData() {
        if (startDate && endDate) {
            try {
                const response = await fetch(`/api/fmi-database`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const { weatherData } = await response.json();
                const existingDates = weatherData.rows.map((entry: { date: string }) => {
                    return entry.date.split('T')[0];
                });
                console.log('existingDates', weatherData);

                const missingDates = getMissingDates(startDate, endDate, existingDates);

                // Process missing dates sequentially
                for (const date of missingDates) {
                    const formattedStartTime = `${date}T00:00:00Z`;
                    const formattedEndTime = `${date}T23:00:00Z`;

                    // Fetch data for the date
                    const combinedData = await fetchFMIObservationData(formattedStartTime, formattedEndTime);

                    // Process the fetched data to calculate mean values
                    const result = processWeatherObservationData(combinedData);


                    // POST data for the missing date
                    const response2 = await fetch('/api/fmi-database', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            result,
                        }),
                    });

                    if (!response2.ok) {
                        throw new Error(`HTTP error! status: ${response2.status}`);
                    }
                }

            } catch (error) {
                console.error('Error fetching weather observation data:', error);
            }
        }
    }


    // Function to generate a range of dates
    const getMissingDates = (start: string, end: string, existingDates: string[]) => {
        const missingDates: string[] = [];
        let startDateObj = new Date(start);
        const endDateObj = new Date(end);

        while (startDateObj <= endDateObj) {
            const currentDate = startDateObj.toISOString().split('T')[0];  // Format as YYYY-MM-DD
            if (!existingDates.includes(currentDate)) {
                missingDates.push(currentDate);
            }
            startDateObj.setDate(startDateObj.getDate() + 1);  // Move to the next day
        }
        return missingDates;
    };

    return (
        <section className="flex justify-center w-full p-6">
            <Button className="w-32 p-2" onClick={fetchData}>Update Database</Button>
        </section>
    );
}
