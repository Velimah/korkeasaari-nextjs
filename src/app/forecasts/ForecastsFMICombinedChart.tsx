"use client";  // Ensure this component is treated as a client component

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Bar,
} from 'recharts';
import { LoadingSpinner } from '../../components/ui/loading-spinner';

interface WeatherData {
  time: string;
  temperature: number;
  cloudcover: number;
  precipitation: number;
}

// Define the WeatherData component
export default function ForecastsFMICombinedChart({ weatherData }: { weatherData: WeatherData[] }) {

  const chartConfig = {
    temperature: {
      label: "Lämpötila (°C)",
      color: "#25582b",
    },
    precipitation: {
      label: "Sademäärä (mm)",
      color: "#aac929",
    },
  } satisfies ChartConfig

  if (!weatherData) {
    return <LoadingSpinner />;
  }

  return (
    <section className="flex justify-center p-6">
      <Card className='w-full text-center'>
        <CardHeader>
          <CardTitle>
            Sääennuste
          </CardTitle>
          <CardDescription>
            Lämpötila ja Sademäärä Seuraavalle 60 Tunnille.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ComposedChart accessibilityLayer data={weatherData}>
              <CartesianGrid vertical={false} />
              <ChartLegend content={<ChartLegendContent />} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    // Access the 'payload' to get the full data object, including the 'date'
                    labelFormatter={(_, payload) => {
                      const dataPoint = payload && payload[0] ? payload[0].payload : null;
                      if (dataPoint) {
                        return new Date(dataPoint.time).toLocaleTimeString("fi-FI", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          weekday: "short",
                        });
                      }
                      return "";
                    }}
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
              <XAxis
                dataKey="time"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  const dayOfWeek = date.toLocaleDateString('fi-FI', { weekday: 'short' }); // e.g., "Ma" for Monday in Finnish
                  const hour = date.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit', hour12: false }); // e.g., "20:00"
                  return `${dayOfWeek} ${hour}`;
                }}
              />

              <YAxis
                yAxisId="left"
                domain={[
                  (dataMin: number) => Math.floor(dataMin - 2),
                  (dataMax: number) => Math.ceil(dataMax + 2),
                ]}
                label={{ value: 'Lämpötila (°C)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: 'Sademäärä (mm)', angle: 90, position: 'insideRight' }}
                domain={[0, (dataMax: number) => Math.ceil(dataMax + 2)]} // Ensures that the max value is slightly above the data max
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
    </section>
  );
}

