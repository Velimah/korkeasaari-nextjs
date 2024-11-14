"use client";  // Ensure this component is treated as a client component

import { useEffect, useState } from "react";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import MLRCalculator from "@/utils/MLRCalculator";
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
import * as WeatherIcons from "@/components/weathericons";
import { BLOB, getBLOBData } from "@/hooks/fetchBLobData";

interface PredictionResults {
  date: string;
  temperature: number;
  precipitation: number;
  cloudcover: number;
  predictedvisitors: number;
}

interface WeatherData {
  time: string;
  temperature: number;
  cloudcover: number;
  precipitation: number;
}

export default function ForecastAndPriceTable({ weatherData }: { weatherData: WeatherData[] }) {
  const [visitorData, setVisitorData] = useState<PredictionResults[]>([]);
  const [blobData, setBlobData] = useState<BLOB[]>([]);

  useEffect(() => {
    async function fetchBlobDataAndCalculate() {
      // Fetch BLOB data
      const data = await getBLOBData();
      setBlobData(data);

      // Run MLRCalculator if both weatherData and blobData are available
      if (weatherData.length > 0 && data.length > 0) {
        const result = MLRCalculator({ weatherData, blobData: data });
        if (result) {
          setVisitorData(result);
        }
      }
    }
    fetchBlobDataAndCalculate();
  }, [weatherData]); // Runs when weatherData changes

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

      <Tabs defaultValue="table" className="xl:w-[700px] w-[610px] max-w-[700px]">
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
                      {result.precipitation == 0 && result.temperature > 2 && result.cloudcover < 10 ? (
                        <WeatherIcons.DrySunnyIcon />
                      ) : result.precipitation == 0 && result.temperature > 2 && result.cloudcover < 25 ? (
                        <WeatherIcons.DryMostlySunnyIcon />
                      ) : result.precipitation == 0 && result.temperature > 2 && result.cloudcover < 50 ? (
                        <WeatherIcons.DryPartlySunnyIcon />
                      ) : result.precipitation == 0 && result.temperature > 2 && result.cloudcover < 75 ? (
                        <WeatherIcons.DryMostlyCloudyIcon />
                      ) : result.precipitation == 0 && result.temperature > 2 && result.cloudcover > 75 ? (
                        <WeatherIcons.DryCloudyIcon />

                      ) : result.precipitation < 2 && result.temperature > 2 && result.cloudcover < 50 ? (
                        <WeatherIcons.RainLightPartlySunnyIcon />
                      ) : result.precipitation < 2 && result.temperature > 2 && result.cloudcover < 75 ? (
                        <WeatherIcons.RainLightMostlyCloudyIcon />
                      ) : result.precipitation < 2 && result.temperature > 2 && result.cloudcover > 75 ? (
                        <WeatherIcons.RainLightCloudyIcon />
                      ) : result.precipitation < 4 && result.temperature > 2 && result.cloudcover < 50 ? (
                        <WeatherIcons.RainAveragePartlySunny />
                      ) : result.precipitation < 4 && result.temperature > 2 && result.cloudcover < 75 ? (
                        <WeatherIcons.RainAverageMostlyCloudyIcon />
                      ) : result.precipitation < 4 && result.temperature > 2 && result.cloudcover > 75 ? (
                        <WeatherIcons.RainAverageCloudyIcon />
                      ) : result.precipitation > 4 && result.temperature > 2 && result.cloudcover < 50 ? (
                        <WeatherIcons.RainHeavyPartlySunnyIcon />
                      ) : result.precipitation > 4 && result.temperature > 2 && result.cloudcover < 75 ? (
                        <WeatherIcons.RainHeavyMostlyCloudyIcon />
                      ) : result.precipitation > 4 && result.temperature > 2 && result.cloudcover > 75 ? (
                        <WeatherIcons.RainHeavyCloudyIcon />

                      ) : result.precipitation < 2 && result.temperature >= -1 && result.temperature <= 2 && result.cloudcover < 75 ? (
                        <WeatherIcons.SleetLightPartlySunnyIcon />
                      ) : result.precipitation < 2 && result.temperature >= -1 && result.temperature <= 2 && result.cloudcover > 75 ? (
                        <WeatherIcons.SleetLightCloudyIcon />
                      ) : result.precipitation < 4 && result.temperature >= -1 && result.temperature <= 2 && result.cloudcover < 75 ? (
                        <WeatherIcons.SleetAveragePartlySunny />
                      ) : result.precipitation < 4 && result.temperature >= -1 && result.temperature <= 2 && result.cloudcover > 75 ? (
                        <WeatherIcons.SleetAverageCloudyIcon />
                      ) : result.precipitation > 4 && result.temperature >= -1 && result.temperature <= 2 && result.cloudcover < 75 ? (
                        <WeatherIcons.SleetHeavyPartlySunnyIcon />
                      ) : result.precipitation > 4 && result.temperature >= -1 && result.temperature <= 2 && result.cloudcover > 75 ? (
                        <WeatherIcons.SleetHeavyCloudyIcon />

                      ) : result.precipitation < 2 && result.temperature < -1 && result.cloudcover < 50 ? (
                        <WeatherIcons.SnowLightPartlySunnyIcon />
                      ) : result.precipitation < 2 && result.temperature < -1 && result.cloudcover < 75 ? (
                        <WeatherIcons.SnowLightMostlyCloudyIcon />
                      ) : result.precipitation < 2 && result.temperature < -1 && result.cloudcover > 75 ? (
                        <WeatherIcons.SnowLightCloudyIcon />
                      ) : result.precipitation < 4 && result.temperature < -1 && result.cloudcover < 50 ? (
                        <WeatherIcons.SnowAveragePartlySunny />
                      ) : result.precipitation < 4 && result.temperature < -1 && result.cloudcover < 75 ? (
                        <WeatherIcons.SnowAverageMostlyCloudyIcon />
                      ) : result.precipitation < 4 && result.temperature < -1 && result.cloudcover > 75 ? (
                        <WeatherIcons.SnowAverageCloudyIcon />
                      ) : result.precipitation > 4 && result.temperature < -1 && result.cloudcover < 50 ? (
                        <WeatherIcons.SnowHeavyPartlySunnyIcon />
                      ) : result.precipitation > 4 && result.temperature < -1 && result.cloudcover < 75 ? (
                        <WeatherIcons.SnowHeavyMostlyCloudyIcon />
                      ) : result.precipitation > 4 && result.temperature < -1 && result.cloudcover > 75 ? (
                        <WeatherIcons.SnowHeavyCloudyIcon />
                      ) : (
                        <LoadingSpinner />
                      )}
                    </TableCell>
                    <TableCell className="text-center">{result.temperature.toFixed(1)} °C</TableCell>
                    <TableCell className="text-center">{result.precipitation.toFixed(1)} mm</TableCell>
                    <TableCell className="text-center">{result.cloudcover.toFixed(1)} %</TableCell>
                    <TableCell className="text-center">{result.predictedvisitors.toFixed(0)}</TableCell>
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
