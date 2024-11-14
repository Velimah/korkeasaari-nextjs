"use client";  // Ensure this component is treated as a client component

import { useEffect, useState } from 'react';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Bar,
  Brush,
} from 'recharts';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BLOB, getBLOBData } from '@/hooks/fetchBLobData';

export default function WeatherHistoricalData() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const years = [0, 2019, 2020, 2021, 2022, 2023, 2024];
  const [blobData, setBlobData] = useState<BLOB[]>([]);
  const [EnkoraFMIData, setEnkoraFMIData] = useState<BLOB[]>([]);


  useEffect(() => {
    async function fetchBlobData() {
      const data = await getBLOBData();
      console.log('BLOBBYDATA:', data);
      setBlobData(data);
      applyYearFilter(selectedYear, data); // Apply initial filter
    }
    fetchBlobData();
  }, []);

  function handleYearChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const year = Number(event.target.value);
    setSelectedYear(year);
    applyYearFilter(year, blobData);
  }

  function applyYearFilter(year: number, data: BLOB[]) {
    const filteredData = year === 0
      ? data
      : data.filter((item) => new Date(item.date).getFullYear() === year);

    setEnkoraFMIData(filteredData);
  }

  const chartConfig = {
    temperature: {
      label: "Keskilämpötila (°C)",
      color: "#25582b",
    },
    precipitation: {
      label: "Sademäärä (mm)",
      color: "#aac929",
    },
  } satisfies ChartConfig

  if (!EnkoraFMIData) {
    return <LoadingSpinner />;
  }

  return (
    <section className="m-6 text-center">

      <div className='py-2'>
        <Select
          onValueChange={(value) =>
            handleYearChange({
              target: { value },
            } as React.ChangeEvent<HTMLSelectElement>)
          }
          value={selectedYear.toString()}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year === 0 ? "Kaikki vuodet" : year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Card className='dark:bg-slate-800 bg-secondary' >
        <CardHeader>
          <CardTitle>
            Keskilämpötila ja Sademäärä 10.00-20.00
          </CardTitle>
          <CardDescription>
            2019-2024
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ComposedChart accessibilityLayer data={EnkoraFMIData}>
              <CartesianGrid vertical={false} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("fi-FI", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        weekday: "short",
                      })
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
                label={{ value: 'Keskilämpötila (°C)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: 'Sademäärä (mm)', angle: 90, position: 'insideRight' }}
              />
              <Bar
                yAxisId="right"
                dataKey="precipitation"
                fill="var(--color-precipitation)"
                radius={[2, 2, 0, 0]}
              />
              <Line
                yAxisId="left"
                dataKey="temperature"
                type="natural"
                stroke="var(--color-temperature)"
                strokeWidth={2}
                dot={false}
              />
              <Brush travellerWidth={20} stroke="#25582b" height={30} />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section >
  );
}