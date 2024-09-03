
"use client";  // Ensure this component is treated as a client component

import React, { useEffect, useState } from 'react';
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
} from 'recharts';
import { fetchWeatherData, WeatherData as WeatherDataType } from '../utils/weatherForecastHook';

// Define the WeatherData component
export default function WeatherData() {
  const [weatherData, setWeatherData] = useState<WeatherDataType | null>(null);

  // Fetch weather data on client side
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchWeatherData();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }

    fetchData();
  }, []);

  if (!weatherData) {
    return <p>Loading...</p>;
  }

  // Utility function to format time as local time
  const formatTime = (timeString: string): string => {
  const date = new Date(timeString);
  return date.toLocaleString(); // Local date and time string
  };

  // Convert fetched data to the format needed for Recharts
  const temperatureData = weatherData.temperatureData.map((entry) => ({
    time: formatTime(entry.time),
    value: entry.value,
  }));

  const cloudCoverData = weatherData.totalCloudCoverData.map((entry) => ({
    time: formatTime(entry.time),
    value: entry.value,
  }));

    const precipitationData = weatherData.precipitationAmountData.map((entry) => ({
    time: formatTime(entry.time),
    value: entry.value,
  }));

  const combinedData = temperatureData.map((tempEntry) => {
    // Find the corresponding cloud cover entry
    const cloudCoverEntry = cloudCoverData.find(
      (cloudEntry) => cloudEntry.time === tempEntry.time
    );

        const precipitationEntry = precipitationData.find(
      (precipitationEntry) => precipitationEntry.time === tempEntry.time
    );

    return {
      time: tempEntry.time,
      temperature: tempEntry.value,
      cloudCover: cloudCoverEntry?.value || 0,
      precipitation: precipitationEntry?.value || 0,
    };
  });

  // Define custom tooltip styles
  const darkModeTooltipStyle = {
    backgroundColor: '#333',  // Dark background
    border: '1px solid #555',  // Slightly lighter border
    color: '#fff',             // White text
  };

  return (
    <section className="space-y-3 px-6 text-center">
      <div>
        <h3>Temperature and Cloud Coverage Forecast</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={combinedData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
            />
            <Tooltip contentStyle={darkModeTooltipStyle} />
            <Legend />
            <YAxis yAxisId="left" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Cloud Cover (%)', angle: 90, position: 'insideRight' }} />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="temperature" 
              stroke="green" 
              activeDot={{ r: 8 }} 
              name="Temperature"
            />
            <Bar yAxisId="right" dataKey="cloudCover" barSize={10} fill="rgba(65, 62, 160, 0.8)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

