"use client";  // Ensure this component is treated as a client component

import { useEffect, useState } from 'react';
import { fetchWeatherHistoricalData } from '@/utils/weatherDataHook';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Bar,
  Brush,
} from 'recharts';

// Define the WeatherData component
export default function WeatherHistoricalData() {
  const [weatherData, setWeatherData] = useState<any | null>(null);

  // Fetch weather data on client side
  useEffect(() => {
    function fetchData() {
      const data = fetchWeatherHistoricalData();
      setWeatherData(data);
      console.log(data);
    }
    fetchData();
  }, []);

  const chartConfig = {
    averageTemperature: {
      label: "Average Temperature (°C)",
      color: "#25582b",
    },
    totalPrecipitation: {
      label: "Total Precipitation (mm)",
      color: "#aac929",
    },
  } satisfies ChartConfig

  if (!weatherData) {
    return <p>Loading...</p>;
  }

  return (
    <section className="m-6 text-center">
      <Card className='dark:bg-slate-800 bg-secondary' >
        <CardHeader>
          <CardTitle>
            Weather data for 2023
          </CardTitle>
          <CardDescription>
            Average Temperature and Daily Precipitation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ComposedChart accessibilityLayer data={weatherData}>
              <CartesianGrid vertical={false} />
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
                          <div className="flex items-center gap-0.5 font-mono font-medium text-right text-foreground">
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
              <ChartLegend content={<ChartLegendContent />} />
              <XAxis
                dataKey="date"
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
              <Brush travellerWidth={20} stroke="#25582b" height={30} />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
}