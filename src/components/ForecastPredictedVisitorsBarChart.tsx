"use client";  // Ensure this component is treated as a client component

import { useEffect, useState } from "react";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import MultivariateLinearRegressionCalculator from "../utils/MultivariateLinearRegressionCalculator";
import { WeatherData as WeatherDataType } from '@/utils/fetchFMIForecastData';
import { H2 } from "./ui/H2";

interface PredictionResults {
  date: string;
  temperature: number;
  precipitation: number;
  predictedVisitors: number;
}

export default function ForecastPredictedVisitorsBarChart({ weatherData }: { weatherData: WeatherDataType[] }) {

  const [visitorData, setVisitorData] = useState<PredictionResults[]>([]);

  useEffect(() => {
    const data = MultivariateLinearRegressionCalculator({ weatherData });
    if (data) {
      setVisitorData(data);
    }
  }, []);

  const chartConfig = {
    predictedVisitors: {
      label: "Kävijämäärä",
      color: "#AAC929",
    },
  } satisfies ChartConfig

  if (!visitorData) {
    return <LoadingSpinner />;
  }

  return (
    <section className="m-6 text-center">

      <div className="">
        <H2 className="p-8">Multivariate Linear Regression Proto</H2>
        <div className="flex justify-center gap-2">
          {visitorData?.map((result, index) => (

            <div key={index}>
              <Card className="p-4 flex flex-col gap-1">
                <p>{new Date(result.date).toLocaleDateString('FI-fi', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p>Keskiämpötila: {result.temperature.toFixed(1)} °C</p>
                <p>Sademäärä: {result.precipitation.toFixed(1)} mm</p>
              </Card>
            </div>

          ))}
        </div>
      </div>

      <div className="flex justify-center p-4">
        <Card className='dark:bg-slate-800 bg-secondary w-1/2' >
          <CardHeader>
            <CardTitle>Korkeasaaren Ennustetut Kävijämäärät</CardTitle>
            <CardDescription>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] pe-6">
              <ComposedChart accessibilityLayer data={visitorData}>
                <CartesianGrid vertical={false} />
                <ChartLegend content={<ChartLegendContent />} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      // Access the 'payload' to get the full data object, including the 'date'
                      labelFormatter={(_, payload) => {
                        const dataPoint = payload && payload[0] ? payload[0].payload : null;
                        if (dataPoint) {
                          return new Date(dataPoint.date).toLocaleDateString('FI-fi', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
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
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('FI-fi', { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' })}
                />
                <YAxis />
                <Bar
                  dataKey="predictedVisitors"
                  fill="var(--color-predictedVisitors)"
                  radius={4}
                />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>

      </div>
    </section>
  );
}