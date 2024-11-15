"use client";  // Ensure this component is treated as a client component

import React, { useEffect, useState } from "react";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Brush, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format, parseISO, subDays } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { fi } from "date-fns/locale"
import { fetchEnkoraData } from "@/hooks/fetchEnkoraVisitorData";
import processEnkoraVisitorData from "@/utils/EnkoraDataFormatter";

interface FormattedVisitorData {
  date: string;
  kulkulupa: number;
  ilmaiskavijat: number;
  paasyliput: number;
  verkkokauppa: number;
  vuosiliput: number;
}

export default function EnkoraData() {
  const today = new Date();
  const lastMonth = subDays(today, 30);

  const [startDate, setStartDate] = useState<string>(lastMonth.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(today.toISOString().split('T')[0]);

  const [visitorData, setVisitorData] = useState<FormattedVisitorData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>(["kulkulupa", "ilmaiskavijat", "paasyliput", "verkkokauppa", "vuosiliput"]);

  const initialStartDate = parseISO(startDate);
  const initialEndDate = parseISO(endDate);

  const [date, setDate] = useState<DateRange | undefined>({
    from: initialStartDate,
    to: initialEndDate,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchEnkoraData(startDate, endDate);
        if (data) {
          const result = processEnkoraVisitorData(data);
          setVisitorData(result);
        }
      } catch (error) {
        console.error('Error fetching visitor data:', error);
      }
    }
    fetchData();
  }, [startDate, endDate]);

  // Handles the date range selection
  const handleDateRange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const start = range.from;
      const end = range.to;
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
      setDate(range);
      console.log('Date range selected:', start, end, range);
    }
  };

  const chartConfig = {
    kulkulupa: {
      label: "Kulkulupa",
      color: "#000000",
    },
    ilmaiskavijat: {
      label: "Ilmaiskävijät",
      color: "#FF3B2F",
    },
    paasyliput: {
      label: "Pääsyliput",
      color: "#AAC929",
    },
    verkkokauppa: {
      label: "Verkkokauppa Pääsyliput",
      color: "#25582b",
    },
    vuosiliput: {
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
        {/*show loading spinner until visitordata is loaded*/}
        {visitorData && visitorData.length > 0 ?
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
                                  {item.payload.ilmaiskavijat + item.payload.paasyliput + item.payload.verkkokauppa + item.payload.vuosiliput}
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
                    label={{ value: 'Kävijämäärä', angle: -90, position: 'insideLeft' }} />
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
                  <Brush travellerWidth={20} stroke="#25582b" height={30} />
                </ComposedChart>
              </ChartContainer>
            </CardContent>
          </Card>
          : <div className="flex-1 justify-center items-center pt-32"> <LoadingSpinner /></div>}
        {/*Checkbox group*/}
        <div className="checkboxGroupHome ml-6 text-left">
          {/*Date picker*/}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[250px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "d.M.y", { locale: fi })} -{" "}
                      {format(date.to, "d.M.y", { locale: fi })}
                    </>
                  ) : (
                    format(date.from, "d.M.y", { locale: fi })
                  )
                ) : (
                  <span>Valitse päivämäärät</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                locale={fi}
                weekStartsOn={1}
                captionLayout="buttons"
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleDateRange}
                numberOfMonths={2}
                disabled={(date) =>
                  date > new Date() || date < new Date("2000-01-01")
                }
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