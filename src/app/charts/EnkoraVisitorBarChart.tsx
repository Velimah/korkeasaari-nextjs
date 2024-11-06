"use client";  // Ensure this component is treated as a client component

import React, { useEffect, useState } from "react";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {Checkbox} from "@/components/ui/checkbox";
import {Calendar} from "@/components/ui/calendar";
import {DateRange} from "react-day-picker";
import {addDays, format, parseISO} from "date-fns";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {CalendarIcon} from "lucide-react";
import {cn} from "@/lib/utils";

export default function EnkoraData() {

  const [visitorData, setVisitorData] = useState<any | null>(null);
  const [startDate, setStartDate] = useState<string>('2024-09-30');
  const [endDate, setEndDate] = useState<string>('2024-10-30');
  const [selectedCategory, setSelectedCategory] = useState<string[]>(["Kulkulupa", "Ilmaiskävijät", "Pääsyliput", "Verkkokauppa_Pääsyliput", "Vuosiliput"]);
  const initialStartDate = parseISO(startDate);
  const initialEndDate = parseISO(endDate);

  const [date, setDate] = useState<DateRange | undefined>({
    from: initialStartDate,
    to: initialEndDate,
  });

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

  // Function to toggle the selected category
  const toggleCategory = (category: string) => {
    setSelectedCategory((prev) => 
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  if (!visitorData) {
    return <LoadingSpinner />;
  }

  return (
    <section className="m-6 text-center">
      <div className="flex justify-between items-start">
        <Card className='dark:bg-slate-800 bg-secondary flex-1'>
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
                          month: "short",
                          year: "numeric",
                          weekday: "short",
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
                />
                <ChartLegend className="" content={<ChartLegendContent />} />
                <YAxis
                  label={{value: 'Kävijämäärä', angle: -90, position: 'insideLeft'}} />
                {/*Render selected tickets*/}
                {selectedCategory.map((category) => (
                  <Bar
                    key={category}
                    dataKey={category}
                    stackId="a"
                    fill={`var(--color-${category})`}
                    radius={[0, 0, 0, 0]}
                  />
                ))}
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>
        {/*Checkbox group*/}
        <div className="checkboxGroupHome ml-6 text-left">
          {/*Date picker*/}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <h3 className="font-bold mt-8">Valitse lipputyypit:</h3>
          <p className="text-gray-500">Valitse haluamasi lipputyypit</p>
          <div className="flex flex-col space-y-4 mt-4">
            {Object.keys(chartConfig).map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedCategory.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                  id={category}
                />
                <label htmlFor={category} className="cursor-pointer">
                  {chartConfig[category as keyof typeof chartConfig].label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}