"use client"; // Ensure this component is treated as a client component

import React, { use, useEffect, useState } from "react";
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
  Bar,
  Brush,
  CartesianGrid,
  ComposedChart,
  XAxis,
  YAxis,
} from "recharts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format, parseISO, set, subDays } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { fi } from "date-fns/locale";
import { BLOB, getBLOBData } from "@/hooks/fetchBLobData";

export default function EnkoraData() {
  const today = new Date();
  const lastMonth = subDays(today, 30);

  const [startDate, setStartDate] = useState<string>(
    lastMonth.toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState<string>(
    today.toISOString().split("T")[0],
  );

  const [blobData, setBlobData] = useState<BLOB[]>([]);
  const [visitorData, setVisitorData] = useState<BLOB[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([
    "kulkulupa",
    "ilmaiskavijat",
    "paasyliput",
    "kampanjakavijat",
    "verkkokauppa",
    "vuosiliput",
  ]);

  const initialStartDate = parseISO(startDate);
  const initialEndDate = parseISO(endDate);

  const [date, setDate] = useState<DateRange | undefined>({
    from: initialStartDate,
    to: initialEndDate,
  });

  useEffect(() => {
    async function fetchBlobData() {
      // Fetch the blob data
      const response = await getBLOBData();
      if ("error" in response) {
        console.error(response.error);
        return;
      }
      // Filter the data within the selected date range
      const filteredResponse = response.filter((item: BLOB) => {
        const date = parseISO(item.date); // Ensure item.date is in ISO format
        return date >= parseISO(startDate) && date <= parseISO(endDate); // Compare dates
      });
      setVisitorData(filteredResponse);
      setBlobData(response);
    }
    fetchBlobData();
  }, [startDate, endDate]);

  const handleDateRange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      // Convert `from` and `to` to Date objects
      const start = range.from;
      const end = range.to;
      // Set the start and end dates as ISO strings
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
      setDate(range);
      // Filter the data within the selected date range
      const newData = blobData.filter((item) => {
        const date = parseISO(item.date); // Ensure item.date is in ISO format
        return date >= start && date <= end; // Compare dates
      });
      // Update the visitor data with the filtered data
      setVisitorData(newData);
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
    kampanjakavijat: {
      label: "Kampanjakävijät",
      color: "blue",
    },
    verkkokauppa: {
      label: "Verkkokauppa",
      color: "#25582b",
    },
    vuosiliput: {
      label: "Vuosiliput",
      color: "#B14D97",
    },
  } satisfies ChartConfig;

  // Function to toggle the selected category
  const toggleCategory = (category: string) => {
    setSelectedCategory((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  return (
    <section className="my-6 text-center">
      <div className="flex items-start justify-between">
        <Card className="flex-1">
          {/*show loading spinner until visitordata is loaded*/}
          {blobData && blobData.length > 0 ? (
            <>
              <CardHeader>
                <CardTitle>Korkeasaaren Kävijämäärät</CardTitle>
                <CardDescription>
                  {new Date(startDate).toLocaleDateString("fi-FI")} -{" "}
                  {new Date(endDate).toLocaleDateString("fi-FI")}
                </CardDescription>
                <CardDescription>
                  Tutki Korkeasaaren kävijämääriä valitsemallasi aikavälillä.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex">
                  <ChartContainer
                    config={chartConfig}
                    className="h-[400px] flex-grow"
                  >
                    <ComposedChart accessibilityLayer data={visitorData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString("fi-FI")
                        }
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            labelFormatter={(value) => {
                              return new Date(value).toLocaleDateString(
                                "fi-FI",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  weekday: "short",
                                },
                              );
                            }}
                            formatter={(value, name, item, index) => (
                              <>
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
                                    {chartConfig[
                                      name as keyof typeof chartConfig
                                    ]?.label || name}
                                  </div>
                                  <div className="flex items-center gap-0.5 text-right font-mono font-medium text-foreground">
                                    {value}
                                  </div>
                                </div>
                                {index === 5 && (
                                  <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                                    Yhteensä
                                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-semibold tabular-nums text-foreground">
                                      {item.payload.ilmaiskavijat +
                                        item.payload.paasyliput +
                                        item.payload.kampanjakavijat +
                                        item.payload.verkkokauppa +
                                        item.payload.vuosiliput}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          />
                        }
                      />
                      <ChartLegend
                        className=""
                        content={<ChartLegendContent />}
                      />
                      <YAxis
                        label={{
                          value: "Kävijämäärä",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
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

                  {/*Checkbox group*/}
                  <div className="checkboxGroupHome ml-10 text-left border rounded-[10px] p-5 h-[330px]">
                    {/*Date picker*/}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-[230px] justify-start text-left font-normal",
                            !date && "text-muted-foreground",
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
                    <CardTitle className="mt-4 font-semibold">Valitse lipputyypit:</CardTitle>
                    <div className="mt-4 flex flex-col space-y-4">
                      {Object.keys(chartConfig).map((category) => (
                        <div
                          key={category}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            checked={selectedCategory.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                            id={category}
                          />
                          <label htmlFor={category} className="text-sm cursor-pointer">
                            {
                              chartConfig[category as keyof typeof chartConfig]
                                .label
                            }
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex-1 items-center justify-center p-56">
              {" "}
              <LoadingSpinner />
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
