import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts";
import { useState } from "react";
import { DryCloudyIcon, DrySunnyIcon, RainHeavyCloudyIcon } from "@/components/weathericons";

interface AnalyticsCharts {
  EnkoraFMIData: Array<{
    date: string;
    kulkulupa: number | null;
    ilmaiskavijat: number | null;
    paasyliput: number | null;
    verkkokauppa: number | null;
    kampanjakavijat: number | null;
    vuosiliput: number | null;
    temperature: number | null;
    precipitation: number | null;
    cloudcover: number | null;
    totalvisitors: number | null;
  }>;
  selectedYear: number;
  chartConfig: ChartConfig;
}

export default function AnalyticsScatterChart({ EnkoraFMIData, selectedYear, chartConfig }: AnalyticsCharts) {
  const [selectedDataKey, setSelectedDataKey] = useState<string>("temperature");

  const handleCheckboxChange = (value: string) => {
    setSelectedDataKey(value);
  };

  return (
    <>
      <div className="pb-4 flex justify-center space-x-10">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedDataKey.includes("temperature")}
            onChange={() => handleCheckboxChange("temperature")}
          />
          <DrySunnyIcon />
          <span>Lämpötila</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedDataKey.includes("precipitation")}
            onChange={() => handleCheckboxChange("precipitation")}
          />
          <RainHeavyCloudyIcon />
          <span>Sademäärä</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedDataKey.includes("cloudcover")}
            onChange={() => handleCheckboxChange("cloudcover")}
          />
          <DryCloudyIcon />
          <span>Pilvisyys</span>
        </label>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Kävijämäärä / {selectedDataKey === "precipitation"
            ? "Sademäärä (mm)"
            : selectedDataKey === "cloudcover"
              ? "Pilvisyys (%)"
              : "Lämpötila (°C)"}</CardTitle>
          <CardDescription>
            {selectedYear === 0 ? "Kaikki vuodet" : selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ScatterChart accessibilityLayer data={EnkoraFMIData}>
              <CartesianGrid vertical={false} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    // Access the 'payload' to get the full data object, including the 'date'
                    labelFormatter={(_, payload) => {
                      const dataPoint = payload && payload[0] ? payload[0].payload : null;
                      if (dataPoint) {
                        return new Date(dataPoint.date).toLocaleDateString("fi-FI", {
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
              <XAxis dataKey="totalvisitors" type="number" name="Kävijämäärä" />
              <YAxis
                dataKey={selectedDataKey}
                type="number"
                name={
                  selectedDataKey === "precipitation"
                    ? "Sademäärä"
                    : selectedDataKey === "cloudcover"
                      ? "Pilvisyys"
                      : "Lämpötila"
                }
                unit={
                  selectedDataKey === "precipitation"
                    ? " mm"
                    : selectedDataKey === "cloudcover"
                      ? "%"
                      : "°C"
                }
              />
              <Scatter
                name="Kävijät/Sade"
                data={EnkoraFMIData}
                fill={selectedDataKey === "precipitation"
                  ? "var(--color-precipitation)"
                  : selectedDataKey === "cloudcover"
                    ? "var(--color-cloudcover)"  // A color for cloud cover
                    : "var(--color-temperature)"}
                stroke="black"
              />
            </ScatterChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
