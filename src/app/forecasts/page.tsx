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

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchFMIForecastData();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }

    fetchData();
  }, [startDate, endDate]);


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