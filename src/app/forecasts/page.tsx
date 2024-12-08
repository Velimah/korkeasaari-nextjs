"use client";
import ForecastsFMICombinedChart from "@/app/forecasts/ForecastsFMICombinedChart";
import { fetchFMIForecastData } from '@/hooks/fetchFMIForecastData';
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ForecastAndPriceTable from "@/app/forecasts/ForecastAndPriceTable";
import UpdateDatabaseAndBlob from "./UpdateDatabaseAndBlob";
import { H2 } from "@/components/ui/H2";
import { Card } from "@/components/ui/card";
import UpdatePredictionsToDatabase from "./UpdatePredictionsToDatabase";
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
        {/**{weatherData && weatherData.length > 0 ? <ForecastAndPriceTable weatherData={weatherData} /> : <div className="p-48"> <LoadingSpinner /></div>}*/}
      </section>
      <PredictionsBarChart />
      {/*
      <div className="flex justify-center gap-4">
        <UpdateDatabaseAndBlob />
        <UpdatePredictionsToDatabase />
      </div>
       */}
    </>
  );
}