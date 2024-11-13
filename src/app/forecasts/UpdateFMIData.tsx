"use client";
import { Button } from "@/components/ui/button";
import { fetchFMIObservationData } from "@/hooks/fetchFMIObservationData";
import processFMIWeatherData from "@/utils/FMIdataFormatter";
import { getMissingDates } from "@/utils/findMissingDates";
import { useState } from "react";

// Define the WeatherData component
export default function UpdateFMIData() {
    const [startDate, setStartDate] = useState<string>('2024-10-01');
    const [endDate, setEndDate] = useState<string>('2024-10-20');

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

                const missingDates = getMissingDates(startDate, endDate, existingDates);

                // Process missing dates sequentially and add timestamps to fetch from FMI
                for (const date of missingDates) {
                    const formattedStartTime = `${date}T00:00:00Z`;
                    const formattedEndTime = `${date}T23:00:00Z`;

                    // Fetch data for the date
                    const combinedData = await fetchFMIObservationData(formattedStartTime, formattedEndTime);

                    // Process the fetched data to calculate mean values
                    const result = processFMIWeatherData(combinedData);
                    console.log('Sending FMI to database:', result);


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

    return (
        <Button className="w-32 p-2 m-2" onClick={fetchData}>Update FMI</Button>
    );
}
