"use client";
import ForecastsFMICombinedChart from "@/app/forecasts/ForecastsFMICombinedChart";
import { fetchFMIForecastData } from '@/hooks/fetchFMIForecastData';
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ForecastAndPriceTable from "@/app/forecasts/ForecastAndPriceTable";
import UpdateDatabaseAndBlob from "./UpdateDatabaseAndBlob";
import { getBLOBData, BLOB } from "@/hooks/fetchBLobData";

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
      const data = await fetchFMIForecastData();
      setWeatherData(data);
    }
    fetchData();
  }, []);

  const [blobData, setBlobData] = useState<BLOB[]>([]);
  useEffect(() => {
    async function fetchBlobData() {
      const data = await getBLOBData();
      setBlobData(data);
      console.log('BLOB:', data);
    }
    fetchBlobData();
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