
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
  } from 'recharts';

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

    // Define custom tooltip styles
    const darkModeTooltipStyle = {
      backgroundColor: '#333',  // Dark background
      border: '1px solid #555',  // Slightly lighter border
      color: '#fff',             // White text
    };

  return (
    <section className="space-y-3 px-6 text-center">
      <h2>Historical Temperature</h2>
      <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={weatherData}
            margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
            />
            <YAxis yAxisId="left" orientation="left" />
            <Tooltip contentStyle={darkModeTooltipStyle} />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="averageTemperature" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
              name="Temperature"
            />
          </LineChart>
        </ResponsiveContainer>
    </section>
  );
}