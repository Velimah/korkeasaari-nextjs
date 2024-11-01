"use client";  // Ensure this component is treated as a client component

import { useEffect, useState } from "react";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import MultivariateLinearRegressionCalculator from "../../utils/MultivariateLinearRegressionCalculator";
import { WeatherData as WeatherDataType } from '@/utils/fetchFMIForecastData';
import { H2 } from "../../components/ui/H2";
import {
  DrySunnyIcon,
  DryCloudyIcon,
  DryMostlyCloudyIcon,
  DryMostlySunnyIcon,
  DryPartlySunnyIcon,
  RainAverageCloudyIcon,
  RainAverageMostlyCloudyIcon,
  RainAveragePartlySunny,
  RainHeavyMostlyCloudyIcon,
  RainHeavyCloudyIcon,
  RainHeavyPartlySunnyIcon,
  RainLightPartlySunnyIcon,
  RainLightMostlyCloudyIcon,
  RainLightCloudyIcon,
  SnowAverageCloudyIcon,
  SnowAverageMostlyCloudyIcon,
  SnowAveragePartlySunny,
  SnowHeavyCloudyIcon,
  SnowHeavyMostlyCloudyIcon,
  SnowHeavyPartlySunnyIcon,
  SnowLightCloudyIcon,
  SnowLightMostlyCloudyIcon,
  SnowLightPartlySunnyIcon,
  SleetAverageCloudyIcon,
  SleetAveragePartlySunny,
  SleetHeavyCloudyIcon,
  SleetHeavyPartlySunnyIcon,
  SleetLightCloudyIcon,
  SleetLightPartlySunnyIcon,
} from "@/components/weathericons";

interface PredictionResults {
  date: string;
  temperature: number;
  precipitation: number;
  cloudCover: number;
  predictedVisitors: number;
}

export default function ForecastAndPriceTable({ weatherData }: { weatherData: WeatherDataType[] }) {
  const [visitorData, setVisitorData] = useState<PredictionResults[]>([]);

  useEffect(() => {
    const data = MultivariateLinearRegressionCalculator({ weatherData });
    if (data) {
      setVisitorData(data);
    }
  }, [weatherData]); // Only run when weatherData changes

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
    <section className="m-6 text-center flex flex-col justify-center items-center">

      <div className="p-4">
        <H2 className="p-4">Sää- ja kävijäennuste</H2>
        <div className="flex gap-2">
          {visitorData?.map((result, index) => (

            <div className="w-full min-w-[200px]" key={index}>
              <Card className="p-4 flex flex-col gap-1">
                <p>{new Date(result.date).toLocaleDateString('FI-fi', { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' })}</p>
                <p>Lämpötila: {result.temperature.toFixed(1)} °C</p>
                <p>Sademäärä: {result.precipitation.toFixed(1)} mm</p>
                <p>Pilvisyys: {result.cloudCover.toFixed(1)} %</p>
                <p>kävijämäärä: {result.predictedVisitors.toFixed(0)}</p>

                {/* Icons for weather forecast */}
                {result.precipitation == 0 && result.temperature > 2 && result.cloudCover < 10 ? (
                  <DrySunnyIcon />
                ) : result.precipitation == 0 && result.temperature > 2 && result.cloudCover < 25 ? (
                  <DryMostlySunnyIcon />
                ) : result.precipitation == 0 && result.temperature > 2 && result.cloudCover < 50 ? (
                  <DryPartlySunnyIcon />
                ) : result.precipitation == 0 && result.temperature > 2 && result.cloudCover < 75 ? (
                  <DryMostlyCloudyIcon />
                ) : result.precipitation == 0 && result.temperature > 2 && result.cloudCover > 75 ? (
                  <DryCloudyIcon />

                ) : result.precipitation < 2 && result.temperature > 2 && result.cloudCover < 50 ? (
                  <RainLightPartlySunnyIcon />
                ) : result.precipitation < 2 && result.temperature > 2 && result.cloudCover < 75 ? (
                  <RainLightMostlyCloudyIcon />
                ) : result.precipitation < 2 && result.temperature > 2 && result.cloudCover > 75 ? (
                  <RainLightCloudyIcon />
                ) : result.precipitation < 4 && result.temperature > 2 && result.cloudCover < 50 ? (
                  <RainAveragePartlySunny />
                ) : result.precipitation < 4 && result.temperature > 2 && result.cloudCover < 75 ? (
                  <RainAverageMostlyCloudyIcon />
                ) : result.precipitation < 4 && result.temperature > 2 && result.cloudCover > 75 ? (
                  <RainAverageCloudyIcon />
                ) : result.precipitation > 4 && result.temperature > 2 && result.cloudCover < 50 ? (
                  <RainHeavyPartlySunnyIcon />
                ) : result.precipitation > 4 && result.temperature > 2 && result.cloudCover < 75 ? (
                  <RainHeavyMostlyCloudyIcon />
                ) : result.precipitation > 4 && result.temperature > 2 && result.cloudCover > 75 ? (
                  <RainHeavyCloudyIcon />

                ) : result.precipitation < 2 && result.temperature >= -1 && result.temperature <= 2 && result.cloudCover < 75 ? (
                  <SleetLightPartlySunnyIcon />
                ) : result.precipitation < 2 && result.temperature >= -1 && result.temperature <= 2 && result.cloudCover > 75 ? (
                  <SleetLightCloudyIcon />
                ) : result.precipitation < 4 && result.temperature >= -1 && result.temperature <= 2 && result.cloudCover < 75 ? (
                  <SleetAveragePartlySunny />
                ) : result.precipitation < 4 && result.temperature >= -1 && result.temperature <= 2 && result.cloudCover > 75 ? (
                  <SleetAverageCloudyIcon />
                ) : result.precipitation > 4 && result.temperature >= -1 && result.temperature <= 2 && result.cloudCover < 75 ? (
                  <SleetHeavyPartlySunnyIcon />
                ) : result.precipitation > 4 && result.temperature >= -1 && result.temperature <= 2 && result.cloudCover > 75 ? (
                  <SleetHeavyCloudyIcon />

                ) : result.precipitation < 2 && result.temperature < -1 && result.cloudCover < 50 ? (
                  <SnowLightPartlySunnyIcon />
                ) : result.precipitation < 2 && result.temperature < -1 && result.cloudCover < 75 ? (
                  <SnowLightMostlyCloudyIcon />
                ) : result.precipitation < 2 && result.temperature < -1 && result.cloudCover > 75 ? (
                  <SnowLightCloudyIcon />
                ) : result.precipitation < 4 && result.temperature < -1 && result.cloudCover < 50 ? (
                  <SnowAveragePartlySunny />
                ) : result.precipitation < 4 && result.temperature < -1 && result.cloudCover < 75 ? (
                  <SnowAverageMostlyCloudyIcon />
                ) : result.precipitation < 4 && result.temperature < -1 && result.cloudCover > 75 ? (
                  <SnowAverageCloudyIcon />
                ) : result.precipitation > 4 && result.temperature < -1 && result.cloudCover < 50 ? (
                  <SnowHeavyPartlySunnyIcon />
                ) : result.precipitation > 4 && result.temperature < -1 && result.cloudCover < 75 ? (
                  <SnowHeavyMostlyCloudyIcon />
                ) : result.precipitation > 4 && result.temperature < -1 && result.cloudCover > 75 ? (
                  <SnowHeavyCloudyIcon />
                ) : (
                  <LoadingSpinner />
                )}

              </Card>
            </div>

          ))}
        </div>
      </div>

      <div className="flex justify-center p-4 w-full max-w-[300px]">
        <Card className='dark:bg-slate-800 bg-secondary' >
          <CardHeader>
            <CardTitle>Korkeasaaren Ennustetut Kävijämäärät</CardTitle>
            <CardDescription>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] pe-6">
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
                          return new Date(dataPoint.date).toLocaleDateString('FI-fi', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
                        }
                        return "";
                      }}
                      formatter={(value, name) => (
                        <>
                          <div className="flex items-center justify-between w-full gap-4 text-xs text-muted-foreground">
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