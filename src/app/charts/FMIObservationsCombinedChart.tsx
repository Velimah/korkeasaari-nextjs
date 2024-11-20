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
  const [blobData, setBlobData] = useState<BLOB[]>([]);
  const [EnkoraFMIData, setEnkoraFMIData] = useState<BLOB[]>([]);
  const [selectedDataKey, setSelectedDataKey] = useState<string>("precipitation");
  const years = [
    { label: "Kaikki vuodet", value: 0 },
    { label: "2019", value: 2019 },
    { label: "2020", value: 2020 },
    { label: "2021", value: 2021 },
    { label: "2022", value: 2022 },
    { label: "2023", value: 2023 },
    { label: "2024", value: 2024 },
    { label: "2025", value: 2025 },
  ];

  useEffect(() => {
    async function fetchBlobData() {
      const response = await getBLOBData();
      if ('error' in response) {
        console.error(response.error);
        return;
      }
      setBlobData(response);
      applyYearFilter(selectedYear, response); // Apply initial filter
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

  // Map selectedDataKey to labels and color variables
  const yAxisLabel = selectedDataKey === "precipitation"
    ? "Sademäärä (mm)"
    : "Pilvisyys (%)";

  const chartConfig = {
    temperature: {
      label: "Lämpötila (°C)",
      color: "#AAC929",
    },
    precipitation: {
      label: "Sademäärä (mm)",
      color: "#0007d1",
    },
    cloudcover: {
      label: "Pilvisyys (%)",
      color: "#00cfc8",
    },
  } satisfies ChartConfig

  return (
    <section className="m-6 text-center">
      <div className='flex gap-4'>

        <div className='py-4'>
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
                  <SelectItem key={year.value} value={year.value.toString()}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="py-4">
          <Select onValueChange={(value) => setSelectedDataKey(value)} value={selectedDataKey.toString()}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder={yAxisLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="precipitation">Sademäärä</SelectItem>
                <SelectItem value="cloudcover">Pilvisyys</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

      </div>


      <Card>
        {EnkoraFMIData && EnkoraFMIData.length > 0 ?
          <>
            <CardHeader>
              <CardTitle>
                {selectedDataKey === "precipitation" ? "Lämpötila ja Sademäärä" : "Lämpötila ja Pilvisyys"}
              </CardTitle>
              <CardDescription>
                {selectedYear === 0 ? "Kaikki vuodet" : selectedYear}
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
                          });
                        }}
                        formatter={(value, name) => (
                          <>
                            <div className="flex items-center justify-between min-w-[130px] w-full gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                                  style={{
                                    "--color-bg": `var(--color-${name})`,
                                  } as React.CSSProperties}
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
                    label={{ value: 'Lämpötila (°C)', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{ value: yAxisLabel, angle: 90, position: 'insideRight' }}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey={selectedDataKey}
                    fill={`var(--color-${selectedDataKey})`}
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
          </>
          : <div className="p-56"> <LoadingSpinner /></div>}
      </Card>

    </section>
  );
}