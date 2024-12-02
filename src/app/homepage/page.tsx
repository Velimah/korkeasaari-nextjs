"use client";
import { fetchFMIForecastData } from '@/hooks/fetchFMIForecastData';
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ForecastAndPriceTable from "@/app/forecasts/ForecastAndPriceTable";
import { H2 } from "@/components/ui/H2";

interface WeatherData {
  time: string;
  temperature: number;
  cloudcover: number;
  precipitation: number;
}

export default function WeatherData() {
  interface WeatherData {
    time: string;
    temperature: number;
    cloudcover: number;
    precipitation: number;
  }

  const [weatherData, setWeatherData] = useState<WeatherData[]>();
  useEffect(() => {
    async function fetchData() {
      const data = await fetchFMIForecastData();
      setWeatherData(data);
    }
    fetchData();
  }, []);

  return (
    <>
      <section className="flex justify-center pt-5 w-full">
        <div className="xl:w-1/3 w-1/2 flex flex-col">
          <H2 className="pt-5 pb-5">
            Tarkkaa dataa vuoden ympäri!
          </H2>
          <div className="flex flex-col">
            <p className="pl-2 pt-10 font-bold">Hallinnoi dataasi tarkasti Zoolyticsin filtteröinnin avulla.</p></div>
          <p className="pl-2 pt-2 pb-8">Filtteröi tarkka ajanjakso miltä haluat dataa.</p>
          <div className="flex justify-center">
            <p className="w-[100%] flex rounded border-b-8" style={{ borderColor: '#AAC929' }}></p>
          </div>
          <p className="pl-2 pt-8 font-bold"> Tarkat ennusteet
          </p>
          <p className="pl-2 pt-2 pb-8" >Ennakoi ajoissa tapahtumia ja myyntejä varten ennusteilla.</p>
          <div className="flex justify-center">
            <p className="w-[100%] flex rounded border-b-8" style={{ borderColor: '#AAC929' }}></p>
          </div>
          <p className="pl-2 pt-8 font-bold"> Dataa monessa eri muodossa
          </p>
          <p className="pl-2 pt-2" >Analysoi dataasi monessa eri muodossa.</p>
        </div>
        {weatherData && weatherData.length > 0 ? <ForecastAndPriceTable weatherData={weatherData} /> : <div className="p-56"> <LoadingSpinner /></div>}
      </section>
    </>
  );
}
