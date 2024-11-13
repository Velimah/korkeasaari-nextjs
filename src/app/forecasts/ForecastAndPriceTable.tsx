"use client";  // Ensure this component is treated as a client component

import { useEffect, useState } from "react";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import MultivariateLinearRegressionCalculator from "@/utils/multivariateLinearRegressionCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

interface WeatherData {
  time: string;
  temperature: number;
  cloudCover: number;
  precipitation: number;
}

export default function ForecastAndPriceTable({ weatherData }: { weatherData: WeatherData[] }) {
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
    <section className="flex justify-center p-6">

      <Tabs defaultValue="table" className="w-full max-w-[700px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">Taulukko</TabsTrigger>
          <TabsTrigger value="chart">Kävijämäärät</TabsTrigger>
        </TabsList>

        <TabsContent value="table">

          <Card className="p-4 w-full">
            <Table>
              <TableCaption>Hinnat ovat placeholdereita toistaiseksi.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center pe-4">Päivä</TableHead>
                  <TableHead></TableHead>
                  <TableHead className="text-center">Lämpötila</TableHead>
                  <TableHead className="text-center">Sademäärä</TableHead>
                  <TableHead className="text-center">Pilvisyys</TableHead>
                  <TableHead className="text-center">Kävijämäärä</TableHead>
                  <TableHead className="text-center">Hinta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitorData?.slice(0, 5).map((result, index) => (

                  <TableRow className="w-full" key={index}>
                    <TableCell className="font-medium pe-4">{new Date(result.date).toLocaleDateString('FI-fi', { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' })}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-center">{result.temperature.toFixed(1)} °C</TableCell>
                    <TableCell className="text-center">{result.precipitation.toFixed(1)} mm</TableCell>
                    <TableCell className="text-center">{result.cloudCover.toFixed(1)} %</TableCell>
                    <TableCell className="text-center">{result.predictedVisitors.toFixed(0)}</TableCell>
                    <TableCell className="text-center font-medium">20 €</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="chart">
          <Card className='h-full' >
            <CardHeader>
              <CardTitle>Ennustetut Kävijämäärät</CardTitle>
              <CardDescription>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full">
                <ComposedChart accessibilityLayer data={visitorData?.slice(0, 5)}>
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
                    tickLine={true}
                    tickMargin={10}
                    axisLine={true}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('FI-fi', { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' })}
                  />
                  <YAxis />
                  <Bar
                    dataKey="predictedVisitors"
                    fill="var(--color-predictedVisitors)"
                    radius={4}
                    barSize={50}
                  />
                </ComposedChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </section>
  );
}
