"use client";
import { H2 } from "@/components/ui/H2";
import ForecastsFMICombinedChart from "@/app/forecasts/ForecastsFMICombinedChart";
import { Metadata } from "next";
import { fetchFMIForecastData, WeatherData as WeatherDataType } from '@/utils/fetchFMIForecastData';
import { fetchFMIObservationData } from '@/utils/fetchFMIObservationData';
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ForecastAndPriceTable from "@/app/forecasts/ForecastAndPriceTable";
import ForecastUpdateData from "./ForecastUpdateData";

/*
export const metadata: Metadata = {
  title: "Ennusteet",
  description: "Sääennuste ja Hinnoittelu.",
};
*/

// Define the WeatherData component
export default function WeatherData() {
  const [weatherData, setWeatherData] = useState<WeatherDataType[]>();

  const [startDate, setStartDate] = useState<string>('2020-03-28');
  const [endDate, setEndDate] = useState<string>('2020-04-05');

  /* Fetch weather data on client side
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchFMIForecastData();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }

    async function fetchData2() {
      try {
        const data = await fetchFMIObservationData(startDate, endDate);
        console.log('weatherdataaaa', data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }

    fetchData2();
    fetchData();
  }, [startDate, endDate]);
  */

  useEffect(() => {
    async function fetchData() {
      if (startDate && endDate) { // Only fetch if both dates are provided
        try {

          const response = await fetch('/api/get-weatherdata', {
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
          console.log('weatherData', weatherData);
          const existingDates = weatherData.rows.map((entry: { date: string }) => {
            return entry.date.split('T')[0];
          });
          console.log('existingDates', existingDates);

          const missingDates = getMissingDates(startDate, endDate, existingDates);
          console.log('missingDates', missingDates);

          missingDates.forEach(async (date) => {
            const currentDateObj = new Date(date); // Parse the date string into a Date object
            // Add one day to the current date
            currentDateObj.setUTCDate(currentDateObj.getUTCDate() + 1);
            // Format the updated date to ISO string and get the date part (yyyy-mm-dd)
            const startDatePlusOne = currentDateObj.toISOString().split('T')[0];
            const formattedDate = `${date}T00:00:00Z`;
            const formattedStartDatePlusOne = `${startDatePlusOne}T00:00:00Z`;

            const response2 = await fetch('/api/post-weatherdata', {
              method: 'POST', // Use POST method
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                formattedDate, // Send start date
                formattedStartDatePlusOne,   // Send end date
              }),
            });

            if (!response2.ok) {
              throw new Error(`HTTP error! status: ${response2.status}`);
            }
          });
          Sleep(10);

        } catch (error) {
          console.error('Error fetching weather observation data:', error);
        }

      }
    }
    fetchData();
  }, [startDate, endDate]);

  function Sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Function to generate a range of dates
  const getMissingDates = (start: string, end: string, existingDates: string[]) => {
    const missingDates: string[] = [];

    // Convert start date to Date object
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


  if (!weatherData) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <section className="flex flex-col w-full">
        <ForecastUpdateData />
        <ForecastsFMICombinedChart weatherData={weatherData} />
        <ForecastAndPriceTable weatherData={weatherData} />
      </section>
    </>
  );
}