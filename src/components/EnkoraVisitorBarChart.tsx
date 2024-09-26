"use client";  // Ensure this component is treated as a client component

import { useEffect, useState } from "react";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts";
import { LoadingSpinner } from "./ui/loading-spinner";

export default function EnkoraData() {

  const [visitorData, setVisitorData] = useState<any | null>(null);
  const [startDate, setStartDate] = useState<string>('2024-09-20');
  const [endDate, setEndDate] = useState<string>('2024-09-24');

  useEffect(() => {
    async function fetchData() {
      if (startDate && endDate) { // Only fetch if both dates are provided
        try {
          const response = await fetch('/api/enkora', {
            method: 'POST', // Use POST method
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              startDate, // Send start date
              endDate,   // Send end date
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setVisitorData(data);

        } catch (error) {
          console.error('Error fetching visitor data:', error);
        }
      }
    }
    fetchData();
  }, [startDate, endDate]);

  const idMap = {
    "2": "Kulkulupa",
    "3": "Ilmaiskävijät",
    "5": "Pääsyliput",
    "18": "Verkkokauppa_Pääsyliput",
    "19": "Vuosiliput"
  };

  // Transforming the input
  interface OutputEntry {
    date: string;
    [key: string]: number | string;
  }

  if (visitorData && visitorData.validations && visitorData.validations.rows) {
    const output: OutputEntry[] = [];
    visitorData.validations.rows.forEach((row: { day: string; service_group_id: string; quantity: string }) => {
      const { day, service_group_id, quantity } = row;
      const activity = idMap[service_group_id as keyof typeof idMap];

      // Find or create an entry for the date
      let entry = output.find(e => e.date === day);
      if (!entry) {
        entry = { date: day };
        output.push(entry);
      }

      // Sum the quantities for each activity
      entry[activity] = (parseInt(entry[activity] as string) || 0) + parseInt(quantity);
    });
    setVisitorData(output);
  }

  const chartConfig = {
    Kulkulupa: {
      label: "Kulkulupa",
      color: "#000000",
    },
    Ilmaiskävijät: {
      label: "Ilmaiskävijät",
      color: "#FF3B2F",
    },
    Pääsyliput: {
      label: "Pääsyliput",
      color: "#AAC929",
    },
    Verkkokauppa_Pääsyliput: {
      label: "Verkkokauppa Pääsyliput",
      color: "#25582b",
    },
    Vuosiliput: {
      label: "Vuosiliput",
      color: "#B14D97",
    },
  } satisfies ChartConfig

  if (!visitorData) {
    return <LoadingSpinner />;
  }

  return (
    <section className="m-6 text-center">
      <div>

        <Card className='dark:bg-slate-800 bg-secondary' >
          <CardHeader>
            <CardTitle>Korkeasaaren Kävijämäärät</CardTitle>
            <CardDescription>
              {new Date(startDate).toLocaleDateString('fi-FI')} - {new Date(endDate).toLocaleDateString('fi-FI')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <ComposedChart accessibilityLayer data={visitorData}>
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
                          month: "long",
                          year: "numeric",
                        })
                      }}
                      formatter={(value, name, item, index) => (
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
                          {index === 4 && (
                            <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                              Yhteensä
                              <div className="ml-auto flex items-baseline gap-0.5 font-mono font-semibold tabular-nums text-foreground">
                                {item.payload.Ilmaiskävijät + item.payload.Pääsyliput + item.payload.Verkkokauppa_Pääsyliput + item.payload.Vuosiliput}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    />
                  }
                  cursor={true}
                  defaultIndex={1}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <YAxis
                  label={{ value: 'Kävijämäärä', angle: -90, position: 'insideLeft' }} />
                <Bar
                  dataKey="Kulkulupa"
                  stackId="a"
                  fill="var(--color-Kulkulupa)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Ilmaiskävijät"
                  stackId="a"
                  fill="var(--color-Ilmaiskävijät)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Vuosiliput"
                  stackId="a"
                  fill="var(--color-Vuosiliput)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Verkkokauppa_Pääsyliput"
                  stackId="a"
                  fill="var(--color-Verkkokauppa_Pääsyliput)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Pääsyliput"
                  stackId="a"
                  fill="var(--color-Pääsyliput)"
                  radius={[0, 0, 0, 0]}
                />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>

      </div>
    </section>
  );
}