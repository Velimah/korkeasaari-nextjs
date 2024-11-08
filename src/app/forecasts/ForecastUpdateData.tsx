"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";


// Define the WeatherData component
export default function ForecastUpdateData() {
    const [startDate, setStartDate] = useState<string>('2024-10-01');
    const [endDate, setEndDate] = useState<string>('2024-10-10');

    async function fetchData() {
        if (startDate && endDate) { // Only fetch if both dates are provided
            try {

                const response = await fetch(`/api/weatherdata`, {
                    method: 'GET', // Use GET method
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Parse the response to get the existing dates from the database
                const { weatherData } = await response.json();
                const existingDates = weatherData.rows.map((entry: { date: string }) => {
                    return entry.date.split('T')[0];
                });
                console.log('existingDates', existingDates);

                const missingDates = getMissingDates(startDate, endDate, existingDates);

                // Process missing dates sequentially
                for (const date of missingDates) {
                    const currentDateObj = new Date(date); // Parse the date string into a Date object
                    currentDateObj.setUTCDate(currentDateObj.getUTCDate() + 1);
                    const startDatePlusOne = currentDateObj.toISOString().split('T')[0];
                    const formattedDate = `${date}T00:00:00Z`;
                    const formattedStartDatePlusOne = `${startDatePlusOne}T00:00:00Z`;

                    const response2 = await fetch('/api/weatherdata', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            formattedDate, // Send start date
                            formattedStartDatePlusOne, // Send end date
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
