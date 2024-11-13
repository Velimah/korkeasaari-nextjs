"use client";
import { Button } from "@/components/ui/button";
import processEnkoraVisitorData from "@/utils/EnkoraDataFormatter";
import { getMissingDates } from "@/utils/findMissingDates";
import { fetchEnkoraData } from "@/hooks/fetchEnkoraVisitorData";
import { useState } from "react";

export default function UpdateEnkoraData() {
    const [startDate, setStartDate] = useState<string>('2024-10-01');
    const [endDate, setEndDate] = useState<string>('2024-10-10');

    async function fetchData() {
        if (startDate && endDate) { // Only fetch if both dates are provided
            try {

                const response = await fetch(`/api/enkora-database`, {
                    method: 'GET', // Use GET method
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Parse the response to get the existing dates from the database
                const { visitorData } = await response.json();
                const existingDates = visitorData.rows.map((entry: { date: string }) => {
                    return entry.date.split('T')[0];
                });

                const missingDates = getMissingDates(startDate, endDate, existingDates);

                // Process missing dates sequentially
                for (const date of missingDates) {
                    // Fetch data
                    const data = await fetchEnkoraData(date, date);

                    let result;
                    if (data) {
                        result = processEnkoraVisitorData(data);

                        // If result is an array and you want just the first object
                        if (Array.isArray(result) && result.length > 0) {
                            result = result[0]; // Use the first object in the array
                        }
                    }

                    // Ensure that result is not undefined and is of the correct type
                    if (result && 'date' in result) {
                        console.log('Sending Enkora to database:', result);

                        await fetch('/api/enkora-database', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                date: result.date,
                                kulkulupa: result.kulkulupa,
                                ilmaiskavijat: result.ilmaiskavijat,
                                paasyliput: result.paasyliput,
                                verkkokauppa: result.verkkokauppa,
                                vuosiliput: result.vuosiliput,
                            }),
                        });
                    }

                }


            } catch (error) {
                console.error('Error fetching visitor observation data:', error);
            }
        }
    }


    return (
        <Button className="w-32 p-2 m-2" onClick={fetchData}>Update Enkora</Button>
    );
}
