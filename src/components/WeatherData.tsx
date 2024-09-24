"use client";  // Ensure this component is treated as a client component

import { useEffect, useState } from 'react';
import { fetchWeatherData, WeatherData as WeatherDataType } from '../utils/weatherForecastHook';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Bar,
} from 'recharts';


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
    return date.toLocaleString('fi-FI'); // Local date and time string
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
      temperature: tempEntry.value.toFixed(1),
      cloudCover: cloudCoverEntry?.value.toFixed(1) || 0,
      precipitation: precipitationEntry?.value.toFixed(1) || 0,
    };
  });

  const chartConfig = {
    temperature: {
      label: "Temperature (°C)",
      color: "#25582b",
    },
    precipitation: {
      label: "Precipitation (mm)",
      color: "#aac929",
    },
  } satisfies ChartConfig

  return (
    <section className="m-6 text-center">
      <div>
        <Card className='dark:bg-slate-800 bg-secondary' >
          <CardHeader>
            <CardTitle>
              Weather Forecast
            </CardTitle>
            <CardDescription>
              Temperature and Precipitation for the next 60 Hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <ComposedChart accessibilityLayer data={combinedData}>
                <CartesianGrid vertical={false} />
                <ChartLegend content={<ChartLegendContent />} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => (
                        <>
                          <div className="flex items-center justify-between min-w-[130px] w-full gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                                style={
                                  {
                                    "--color-bg": `var(--color-${name})`,
                                  } as React.CSSProperties
                                }
                              />
                              {chartConfig[name as keyof typeof chartConfig]?.label || name}
                            </div>
                            <div className="flex items-center font-mono font-medium text-right text-foreground">
                              {value}
                            </div>
                          </div>
                        </>
                      )}
                    />
                  }
                  cursor={true}
                  defaultIndex={1}
                />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  domain={[
                    (dataMin: number) => Math.floor(dataMin - 2),
                    (dataMax: number) => Math.ceil(dataMax + 2),
                  ]}
                  label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{ value: 'Precipitation (mm)', angle: 90, position: 'insideRight' }}
                  domain={[0, (dataMax: number) => Math.ceil(dataMax + 10)]} // Ensures that the max value is slightly above the data max
                />
                <Bar
                  yAxisId="right"
                  dataKey="precipitation"
                  fill="var(--color-precipitation)"
                  radius={4}
                />
                <Line
                  yAxisId="left"
                  dataKey="temperature"
                  type="natural"
                  stroke="var(--color-temperature)"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

