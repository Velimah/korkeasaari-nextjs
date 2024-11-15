import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Brush, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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

export default function AnalyticsComposedChart({
  EnkoraFMIData,
  selectedYear,
  chartConfig
}: AnalyticsCharts) {
  const [selectedDataKey, setSelectedDataKey] = useState<string>("temperature");

  // Map selectedDataKey to labels and color variables
  const yAxisLabel = selectedDataKey === "precipitation"
    ? "Sademäärä (mm)"
    : selectedDataKey === "cloudcover"
      ? "Pilvisyys (%)"
      : "Lämpötila (°C)";

  const lineOrBarColor = `var(--color-${selectedDataKey})`;

  return (
    <>
      <div className="py-4">
        <Select onValueChange={(value) => setSelectedDataKey(value)} value={selectedDataKey.toString()}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder={yAxisLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="temperature">Lämpötila</SelectItem>
              <SelectItem value="precipitation">Sademäärä</SelectItem>
              <SelectItem value="cloudcover">Pilvisyys</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {EnkoraFMIData && EnkoraFMIData.length > 0 ?
        <Card className='dark:bg-slate-800 bg-secondary'>
          <CardHeader>
            <CardTitle>Kävijämäärä ja {yAxisLabel}</CardTitle>
            <CardDescription>
              {selectedYear === 0 ? "Kaikki vuodet" : selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <ComposedChart accessibilityLayer data={EnkoraFMIData} barGap={0} barCategoryGap="5%">
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('fi-FI')}
                />
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
                        <div className="flex items-center justify-between min-w-[130px] w-full gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                              style={{
                                "--color-bg": `var(--color-${name})`
                              } as React.CSSProperties}
                            />
                            {chartConfig[name as keyof typeof chartConfig]?.label || name}
                          </div>
                          <div className="flex items-center gap-0.5 font-mono font-medium text-right text-foreground">
                            {value}
                          </div>
                        </div>
                      )}
                    />
                  }
                  cursor={true}
                  defaultIndex={1}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{ value: 'Kävijämäärä', angle: 90, position: 'insideRight' }}
                />
                <YAxis
                  yAxisId="left"
                  domain={
                    selectedDataKey === "temperature"
                      ? [
                        (dataMin: number) => Math.floor(dataMin - 2),
                        (dataMax: number) => Math.ceil(dataMax + 2),
                      ]
                      : selectedDataKey === "cloudcover"
                        ? [0, 200] // Set domain for cloudcover bars to 0-100%
                        : ['auto', 'auto']
                  }
                  label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
                />

                <Bar
                  dataKey="totalvisitors"
                  yAxisId="right"
                  stackId="a"
                  fill="var(--color-totalvisitors)"
                  radius={[2, 2, 0, 0]}
                />
                {selectedDataKey === "temperature" ? (
                  <Line
                    yAxisId="left"
                    dataKey="temperature"
                    type="natural"
                    stroke={lineOrBarColor}
                    strokeWidth={2}
                    dot={false}
                  />
                ) : (
                  <Bar
                    yAxisId="left"
                    dataKey={selectedDataKey}
                    fill={lineOrBarColor}
                    radius={[2, 2, 0, 0]}
                  />
                )}
                <Brush travellerWidth={20} stroke="#25582b" height={30} />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>
        : <div className="flex-1 justify-center items-center pt-32"> <LoadingSpinner /></div>}
    </>
  );
}


