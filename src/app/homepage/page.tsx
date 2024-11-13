"use client";
import { fetchFMIForecastData } from '@/hooks/fetchFMIForecastData';
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ForecastAndPriceTable from "@/app/forecasts/ForecastAndPriceTable";
import {H2} from "@/components/ui/H2";

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
            <section className="flex justify-center w-full">
                <div className="w-1/3">
                    <H2 className="p-5">
                    Tarkkaa Dataa vuoden ympäri
                </H2>
                    <div className="flex flex-col">
                <p className="pl-5 font-bold">Hallinnoi dataasi tarkasti Zoolyticsin filtteröinnin avulla.</p></div>
                <p className="pl-5 pt-2">Zoolyticsin avulla voit filtteröidä tarkan ajanjakson miltä haluat dataa.</p>
                </div>
                <ForecastAndPriceTable weatherData={weatherData} />
            </section>
        </>
    );
}
