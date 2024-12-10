"use client";  // Ensure this component is treated as a client component

import { useEffect, useState } from "react";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts";
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
import { getBLOBData } from "@/hooks/fetchBLobData";
import { getWeatherIcon } from "./ForecastWeatherIcons";

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

  useEffect(() => {
    async function fetchBlobDataAndCalculate() {
      // Fetch BLOB data
      const response = await getBLOBData();
      if ('error' in response) {
        console.error(response.error);
        return;
      }

      // Run MLRCalculator if both weatherData and blobData are available
      if (weatherData.length > 0 && response.length > 0) {
        const result = MLRCalculator({ weatherData, blobData: response });
        if (result) {
          setVisitorData(result);
        }
      }
    }
    fetchBlobDataAndCalculate();
  }, [weatherData]); // Runs when weatherData changes

  const chartConfig = {
    predictedvisitors: {
      label: "Ennustettu Kävijämäärä",
      color: "#FA9F42",
    },
  } satisfies ChartConfig


  const getMonthlyThresholds = (month: number): { temperature: number; rain: number; visitors: number } => {
    switch (month) {
      case 0: // Tammikuu
        return { temperature: -10, rain: 5, visitors: 150 };
      case 1: // Helmikuu
        return { temperature: -5, rain: 5, visitors: 200 };
      case 2: // Maaliskuu
        return { temperature: -3, rain: 5, visitors: 250 };
      case 3: // Huhtikuu
        return { temperature: -1, rain: 5, visitors: 300 };
      case 4: // Toukokuu
        return { temperature: 5, rain: 8, visitors: 900 };
      case 5: // Kesäkuu
        return { temperature: 10, rain: 8, visitors: 1200 };
      case 6: // Heinäkuu
        return { temperature: 15, rain: 7, visitors: 1400 };
      case 7: // Elokuu
        return { temperature: 10, rain: 5, visitors: 1000 };
      case 8: // Syyskuu
        return { temperature: 7, rain: 8, visitors: 700 };
      case 9: // Lokakuu
        return { temperature: 3, rain: 9, visitors: 400 };
      case 10: // Marraskuu
        return { temperature: 0, rain: 10, visitors: 200 };
      case 11: // Joulukuu
        return { temperature: -5, rain: 10, visitors: 150 };
      default:
        throw new Error("Invalid month provided.");
    }
  };

  return (
    <section className="flex justify-center p-6">

      <Tabs defaultValue="table" className="xl:w-[700px] w-[610px] max-w-[700px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">Taulukko</TabsTrigger>
          <TabsTrigger value="chart">Kävijäennusteet</TabsTrigger>
        </TabsList>

        <TabsContent value="table">

          <Card className="p-4 w-full">
            <Table>
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center pe-4">Päivä</TableHead>
                  <TableHead></TableHead>
                  <TableHead className="text-center">Lämpötila</TableHead>
                  <TableHead className="text-center">Sademäärä</TableHead>
                  <TableHead className="text-center pe-10">Pilvisyys</TableHead>
                  <TableHead className="text-center">Kävijäennuste</TableHead>
                  <TableHead className="text-center">Hinta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitorData?.slice(1, 5).map((result, index) => (

                  <TableRow className="w-full" key={index}>
                    <TableCell className="pe-4">
                      {new Date(result.date)
                        .toLocaleDateString('FI-fi', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'numeric',
                          year: 'numeric',
                        })
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </TableCell>
                    <TableCell>
                      {/* Icons for weather forecast */}
                      {getWeatherIcon(result.precipitation, result.temperature, result.cloudcover)}
                    </TableCell>
                    <TableCell className="text-center">{result.temperature.toFixed(1)} °C</TableCell>
                    <TableCell className="text-center">{result.precipitation.toFixed(1)} mm</TableCell>
                    <TableCell className="text-center pe-10">{result.cloudcover.toFixed(0)} %</TableCell>
                    <TableCell className="text-center">{result.predictedvisitors.toFixed(0)}</TableCell>
                    <TableCell className="text-center font-semibold">
                      {(() => {
                        const date = new Date(result.date);
                        const month = date.getMonth(); // Get the month (0-based)
                        const { temperature, rain, visitors } = getMonthlyThresholds(month);

                        const isGoodTemperature = result.temperature >= temperature;
                        const isGoodRain = result.precipitation <= rain;
                        const isGoodVisitors = result.predictedvisitors >= visitors;

                        const goodConditionsCount =
                          (isGoodTemperature ? 1 : 0) +
                          (isGoodRain ? 1 : 0) +
                          (isGoodVisitors ? 1 : 0);

                        switch (goodConditionsCount) {
                          case 3:
                            return "20 €";
                          case 2:
                            return "18.5 €";
                          case 1:
                            return "16.5 €";
                          default:
                            return "16.5 €";
                        }
                      })()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="chart">
          <Card className='h-full'>
            <CardHeader>
              <CardTitle className="text-center">Ennustetut Kävijämäärät (4 päivää)</CardTitle>
              <CardDescription>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full">
                <ComposedChart accessibilityLayer data={visitorData?.slice(1, 5)}>
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
                    dataKey="predictedvisitors"
                    fill="var(--color-predictedvisitors)"
                    radius={[2, 2, 0, 0]}
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
