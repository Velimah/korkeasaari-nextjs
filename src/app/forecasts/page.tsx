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
  cloudcover: number;
  precipitation: number;
}

export default function WeatherData() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>();
  useEffect(() => {
    async function fetchData() {
      const data = await fetchFMIForecastData();
      setWeatherData(data);
    }
    fetchData();
  }, []);

  if (!weatherData) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <UpdateDatabaseAndBlob />
      <section className="flex flex-col w-full">
        <ForecastsFMICombinedChart weatherData={weatherData} />
        <ForecastAndPriceTable weatherData={weatherData} />
      </section>
    </>
  );
}