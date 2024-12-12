"use client";
import ForecastsFMICombinedChart from "@/app/forecasts/ForecastsFMICombinedChart";
import { fetchFMIForecastData } from '@/hooks/fetchFMIForecastData';
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card } from "@/components/ui/card";
import PredictionsBarChart from "./PredictionsBarChart";

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

  useEffect(() => {
    document.title = "Ennusteet";
  }, []);

  return (
    <>
      <section className="flex flex-col w-full">
        {weatherData && weatherData.length > 0 ? <ForecastsFMICombinedChart weatherData={weatherData} /> : <Card><div className=" p-48"> <LoadingSpinner /></div></Card>}
      </section>
      <section>
        <PredictionsBarChart />
      </section>
    </>
  );
}