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
import { BLOB, getBLOBData } from "@/hooks/fetchBLobData";
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
          console.log("Visitor data calculated:", result);
          setVisitorData(result);
        }
      }
    }
    fetchBlobDataAndCalculate();
  }, [weatherData]); // Runs when weatherData changes

  const chartConfig = {
    predictedvisitors: {
      label: "Ennustettu Kävijämäärä",
      color: "#AAC929",
    },
  } satisfies ChartConfig

  return (
    <section className="flex justify-center p-6">

      <Tabs defaultValue="table" className="xl:w-[700px] w-[610px] max-w-[700px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">Taulukko</TabsTrigger>
          <TabsTrigger value="chart">Kävijäennustegraafi</TabsTrigger>
        </TabsList>

        <TabsContent value="table">

          <Card className="p-4 w-full">
            <Table>
              <TableCaption>Hinnat ovat toistaiseksi placeholdereita.</TableCaption>
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
                {visitorData?.slice(0, 5).map((result, index) => (

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
                    <TableCell className="text-center font-semibold">20 €</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="chart">
          <Card className='h-full'>
            <CardHeader>
              <CardTitle className="text-center">Ennustetut Kävijämäärät</CardTitle>
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
