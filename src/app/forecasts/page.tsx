"use client";
import ForecastsFMICombinedChart from "@/app/forecasts/ForecastsFMICombinedChart";
import { fetchFMIForecastData } from '@/hooks/fetchFMIForecastData';
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ForecastAndPriceTable from "@/app/forecasts/ForecastAndPriceTable";
import UpdateDatabaseAndBlob from "./UpdateDatabaseAndBlob";

interface WeatherData {
  time: string;
  temperature: number;
  cloudCover: number;
  precipitation: number;
}

export default function WeatherData() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>();

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
  }, []);


  if (!weatherData) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="flex justify-center items-center w-full p-6">
        <UpdateDatabaseAndBlob />
      </div>
      <section className="flex flex-col w-full">
        <ForecastsFMICombinedChart weatherData={weatherData} />
        <ForecastAndPriceTable weatherData={weatherData} />
      </section>
    </>
  );
}