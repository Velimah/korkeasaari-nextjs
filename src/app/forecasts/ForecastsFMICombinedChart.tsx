"use client"; // Ensure this component is treated as a client component

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Bar,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface WeatherData {
  time: string;
  temperature: number;
  cloudcover: number;
  precipitation: number;
}

// Define the WeatherData component
export default function ForecastsFMICombinedChart({
  weatherData,
}: {
  weatherData: WeatherData[];
}) {
  const [selectedDataKey, setSelectedDataKey] =
    useState<string>("precipitation");

  // Map selectedDataKey to labels and color variables
  const yAxisLabel =
    selectedDataKey === "precipitation" ? "Sademäärä (mm)" : "Pilvisyys (%)";

  const chartConfig = {
    temperature: {
      label: "Lämpötila (°C)",
      color: "#AAC929",
    },
    precipitation: {
      label: "Sademäärä (mm)",
      color: "#618985",
    },
    cloudcover: {
      label: "Pilvisyys (%)",
      color: "rgba(110, 136, 148, 0.15)",
    },
  } satisfies ChartConfig;

  return (
    <section className="flex flex-col justify-center p-6">
      <Card className="w-full text-center">
        <CardHeader className="py-10">
          <CardTitle className="pb-2">
            Lämpötila ja{" "}
            {selectedDataKey == "precipitation" ? "Sademäärä" : "Pilvisyys"}
          </CardTitle>
          <CardDescription>
            Tutki seuraavan viiden päivän sääennustetta. Valikosta voit valita
            haluatko nähdä pilvisyyden vai sademäärän.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between px-16">
            <div className="py-4">
              <Select
                onValueChange={(value) => setSelectedDataKey(value)}
                value={selectedDataKey.toString()}
              >
                <SelectTrigger className="w-[150px]">
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
            <CardDescription className="mt-10">
              <small>Lähde: Ilmatieteenlaitos</small>
            </CardDescription>
          </div>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ComposedChart accessibilityLayer data={weatherData}>
              <CartesianGrid vertical={false} />
              <ChartLegend content={<ChartLegendContent />} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const dataPoint =
                        payload && payload[0] ? payload[0].payload : null;
                      if (dataPoint) {
                        return new Date(dataPoint.time).toLocaleTimeString(
                          "fi-FI",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            weekday: "short",
                          },
                        );
                      }
                      return "";
                    }}
                    formatter={(value, name) => (
                      <div className="flex w-full min-w-[130px] items-center justify-between gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                            style={
                              {
                                "--color-bg": `var(--color-${name})`,
                              } as React.CSSProperties
                            }
                          />
                          {chartConfig[name as keyof typeof chartConfig]
                            ?.label || name}
                        </div>
                        <div className="flex items-center gap-0.5 text-right font-mono font-medium text-foreground">
                          {value}
                        </div>
                      </div>
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
                  const dayOfWeek = date.toLocaleDateString("fi-FI", {
                    weekday: "short",
                  });
                  const hour = date.toLocaleTimeString("fi-FI", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });
                  return `${dayOfWeek} ${hour}`;
                }}
              />

              <YAxis
                yAxisId="left"
                domain={[
                  (dataMin: number) => Math.floor(dataMin - 2),
                  (dataMax: number) => Math.ceil(dataMax + 2),
                ]}
                label={{
                  value: "Lämpötila (°C)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: yAxisLabel,
                  angle: 90,
                  position: "insideRight",
                }}
                domain={[0, (dataMax: number) => Math.ceil(dataMax + 2)]}
              />

              {/* Conditionally render Bar based on selectedDataKey */}
              {selectedDataKey === "precipitation" ||
                selectedDataKey === "cloudcover" ? (
                <Bar
                  yAxisId="right"
                  dataKey={selectedDataKey}
                  fill={`var(--color-${selectedDataKey})`}
                  radius={[2, 2, 0, 0]}
                />
              ) : null}

              <Line
                yAxisId="left"
                dataKey="temperature"
                type="natural"
                stroke="var(--color-temperature)"
                strokeWidth={3}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
}
