"use client";
import { H2 } from "@/components/ui/H2";
import ForecastsFMIObservationsCombinedChart from "@/components/ForecastsFMIObservationsCombinedChart";
import { Metadata } from "next";
import { fetchFMIForecastData, WeatherData as WeatherDataType } from '@/utils/fetchFMIForecastData';
import { useEffect, useState } from "react";
import MultivariateLinearRegressionCalculator from "@/components/MultivariateLinearRegressionCalculator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

/*
export const metadata: Metadata = {
  title: "Ennusteet",
  description: "Sääennuste ja Hinnoittelu.",
};
*/
// Define the WeatherData component
export default function WeatherData() {
  const [weatherData, setWeatherData] = useState<WeatherDataType[]>();

  // Fetch weather data on client side
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
      <section className="px-1 py-8">
        <section className="items-center flex justify-center px-8">
          <div className="space-y-3">
            <H2 className="text-center sm:text-start"> Sääennuste ja Hinnoittelu</H2>
          </div>
        </section>
      </section>
      <section className="space-y-3 text-center">
        <ForecastsFMIObservationsCombinedChart weatherData={weatherData} />
        <MultivariateLinearRegressionCalculator weatherData={weatherData} />
      </section>
    </>
  );
}