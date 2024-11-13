"use client";
import ForecastsFMICombinedChart from "@/app/forecasts/ForecastsFMICombinedChart";
import { Metadata } from "next";
import { fetchFMIForecastData } from '@/hooks/fetchFMIForecastData';
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ForecastAndPriceTable from "@/app/forecasts/ForecastAndPriceTable";
import UpdateFMIData from "./UpdateFMIData";
import UpdateEnkoraData from "./UpdateEnkoraData";

/*
export const metadata: Metadata = {
  title: "Ennusteet",
  description: "Sääennuste ja Hinnoittelu.",
};
*/

interface WeatherData {
  time: string;
  temperature: number;
  cloudCover: number;
  precipitation: number;
}

export default function WeatherData() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>();

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
      <div className="flex justify-center items-center w-full max-w-80 p-6">
        <UpdateFMIData />
        <UpdateEnkoraData />
      </div>
      <section className="flex flex-col w-full">
        <ForecastsFMICombinedChart weatherData={weatherData} />
        <ForecastAndPriceTable weatherData={weatherData} />
      </section>
    </>
  );
}