
"use client";  // Ensure this component is treated as a client component

import React, { useEffect, useState } from 'react';
import { fetchWeatherHistoricalData } from '@/utils/weatherDataHook';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Brush,
} from 'recharts';
import { H2 } from './ui/H2';

// Define the WeatherData component
export default function WeatherHistoricalData() {
    const [weatherData, setWeatherData] = useState<any | null>(null);

  // Fetch weather data on client side
  useEffect(() => {
     function fetchData() {
        const data =  fetchWeatherHistoricalData();
        setWeatherData(data);
        console.log(data);
    }
    fetchData();
  }, []);

  /*
    // Define custom tooltip styles
    const darkModeTooltipStyle = {
      backgroundColor: '#333',  // Dark background
      border: '1px solid #555',  // Slightly lighter border
      color: '#fff',             // White text
    };
  */
  
  if (!weatherData) {
    return <p>Loading...</p>;
  }
  
  return (
    <section className="py-6 px-6 text-center">
      <H2>Temperatures and Precipitation between 10:00-20:00 for year 2023</H2>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={weatherData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString()} 
          />
          <YAxis yAxisId="left" domain={[(dataMin: number) => dataMin - 2, (dataMax: number) => dataMax + 2]}  label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Precipitation (mm)', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="averageTemperature" 
            stroke="green"
            activeDot={{ r: 8 }} 
            name="Temperature"
          />
          <Bar yAxisId="right" name="Precipitation" dataKey="totalPrecipitation" barSize={10} fill="rgba(65, 62, 160, 0.8)" />
          <Brush />
        </ComposedChart>
        </ResponsiveContainer>
    </section>
  );
}