
"use client";  // Ensure this component is treated as a client component

import React, { useEffect, useState } from 'react';
import { fetchWeatherHistoricalData } from '@/utils/weatherDataHook';
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ComposedChart,
    Bar,
    Brush,
} from 'recharts';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"
import { H2 } from './ui/H2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

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
  
  if (!weatherData) {
    return <p>Loading...</p>;
  }

  const chartConfig = {
    averageTemperature: {
      label: "Average Temperature",
      color: "#25582b",
    },
      totalPrecipitation: {
      label: "Total Precipitation",
      color: "#aac929",
    },
  } satisfies ChartConfig
  
  return (
    <section className="py-6 px-6 text-center">
      <Card>
        <CardHeader>
          <CardTitle>
            Weather Forecast
          </CardTitle>
          <CardDescription>
            Temperature and Cloud Cover for the next 60 Hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ComposedChart accessibilityLayer data={weatherData}>
            <CartesianGrid vertical={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis
              yAxisId="left"
              domain={[(dataMin: number) => dataMin - 2, (dataMax: number) => dataMax + 2]}
              label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
            />
           <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: 'Precipitation (mm)', angle: 90, position: 'insideRight' }}
            />
            <Bar
              yAxisId="right"
              dataKey="totalPrecipitation"
              fill="var(--color-totalPrecipitation)"
              radius={4}
            />
            <Line
              yAxisId="left"
              dataKey="averageTemperature"
              type="natural"
              stroke="var(--color-averageTemperature)"
              strokeWidth={2}
              dot={false}
          />
          <Brush />
          </ComposedChart>
          </ChartContainer>
                  </CardContent>
      </Card>
    </section>
  );
}