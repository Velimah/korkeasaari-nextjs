"use client";  // Ensure this component is treated as a client component

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart } from "recharts";

interface AnalyticsPieChart {
  visitorTotals: Array<{ name: string; value: number }>;
  selectedYear: number;
  chartConfig: ChartConfig;
}

export default function AnalyticsPieChart({ visitorTotals, selectedYear, chartConfig }: AnalyticsPieChart) {

  return (

    <Card className='dark:bg-slate-800 bg-secondary' >
      <CardHeader className="items-center pb-0">
        <CardTitle>Kävijöiden jakauma lipputyypin mukaan</CardTitle>
        <CardDescription>{selectedYear === 0 ? "Kaikki vuodet" : selectedYear}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="h-[400px] w-full"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    // Format the value with spaces as thousands separators
                    const formattedValue = new Intl.NumberFormat('en-US', {
                      useGrouping: true,
                      minimumFractionDigits: 0,
                    }).format(value as number).replace(/,/g, ',');

                    return (
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
                          {formattedValue}
                        </div>
                      </div>
                    );
                  }}
                />
              }
              cursor={true}
              defaultIndex={1}
            />

            <Pie data={visitorTotals} dataKey="value" nameKey="name" startAngle={90} endAngle={450} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}