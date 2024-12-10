import React, { useEffect, useState } from "react";
import {
  ChartContainer,
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
import { getBLOBData, BLOB } from "@/hooks/fetchBLobData";
import { getVisitorPredictions } from "@/hooks/fetchVisitorPredictionData";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PredictionsBarChart() {
  const [blobData, setBlobData] = useState<BLOB[]>([]);
  const [enkoraFMIData, setEnkoraFMIData] = useState<BLOB[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // 0 means "all months"
  const months = [
    { label: "Kaikki kuukaudet", value: 0 },
    { label: "Tammikuu", value: 1 },
    { label: "Helmikuu", value: 2 },
    { label: "Maaliskuu", value: 3 },
    { label: "Huhtikuu", value: 4 },
    { label: "Toukokuu", value: 5 },
    { label: "Kesäkuu", value: 6 },
    { label: "Heinäkuu", value: 7 },
    { label: "Elokuu", value: 8 },
    { label: "Syyskuu", value: 9 },
    { label: "Lokakuu", value: 10 },
    { label: "Marraskuu", value: 11 },
    { label: "Joulukuu", value: 12 },
  ];
  const years = [
    { label: "Kaikki vuodet", value: 0 },
    { label: "2024", value: 2024 },
    { label: "2025", value: 2025 },
  ];

  useEffect(() => {
    async function fetchData() {
      const blobResponse = await getBLOBData();
      const predictionResponse = await getVisitorPredictions();

      if ("error" in blobResponse || "error" in predictionResponse) {
        console.error("Error fetching data");
        return;
      }

      // Filter BLOB data to include only entries from 2024-11-19 onwards
      const filteredBlobResponse = blobResponse.filter(
        (blob) => new Date(blob.date) >= new Date("2024-11-19"),
      );

      // Merge BLOB and Prediction data by date
      const mergedData = filteredBlobResponse.map((blob) => ({
        ...blob,
        ...predictionResponse.find((pred) => pred.date === blob.date),
      }));
      setBlobData(mergedData);
      applyFilters(selectedYear, selectedMonth, mergedData);
    }
    fetchData();
  }, [selectedMonth, selectedYear]);

  const chartConfig = {
    kulkulupa: { label: "Kulkulupa", color: "#000000" },
    ilmaiskavijat: { label: "Ilmaiskävijät", color: "#FF3B2F" },
    paasyliput: { label: "Pääsyliput", color: "#AAC929" },
    kampanjakavijat: { label: "Kampanjakävijät", color: "blue" },
    verkkokauppa: { label: "Verkkokauppa", color: "#25582b" },
    vuosiliput: { label: "Vuosiliput", color: "#B14D97" },
    day1prediction: { label: "Ennuste 1 päivän päähän", color: "#FFB3B3" },
    day2prediction: { label: "Ennuste 2 päivän päähän", color: "#C3E88D" },
    day3prediction: { label: "Ennuste 3 päivän päähän", color: "#82CFFA" },
    day4prediction: { label: "Ennuste 4 päivän päähän", color: "#FFEE99" },
  };

  function handleYearChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const year = Number(event.target.value);
    setSelectedYear(year);
    applyFilters(year, selectedMonth, blobData);
  }

  function handleMonthChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const month = Number(event.target.value);
    setSelectedMonth(month);
    applyFilters(selectedYear, month, blobData);
  }

  function applyFilters(year: number, month: number, data: BLOB[]) {
    const filteredByYear =
      year === 0
        ? data
        : data.filter((item) => new Date(item.date).getFullYear() === year);
    const filteredByMonth =
      month === 0
        ? filteredByYear
        : filteredByYear.filter(
            (item) => new Date(item.date).getMonth() + 1 === month,
          );

    setEnkoraFMIData(filteredByMonth);
  }

  return (
    <section className="m-6 text-center">
      <Card>
        {enkoraFMIData && enkoraFMIData.length > 0 ? (
          <>
            <CardHeader className="py-10">
              <CardTitle className="pb-2">
                Korkeasaaren Kävijämääräennusteet
              </CardTitle>
              <CardDescription>
                Tutki menneitä kävijämääriä ja niiden perusteella laskettuja
                ennusteita.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 px-16">
                <div className="py-4">
                  <Select
                    onValueChange={(value) =>
                      handleYearChange({
                        target: { value },
                      } as React.ChangeEvent<HTMLSelectElement>)
                    }
                    value={selectedYear.toString()}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select a year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {years.map((year) => (
                          <SelectItem
                            key={year.value}
                            value={year.value.toString()}
                          >
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="py-4">
                  <Select
                    onValueChange={(value) =>
                      handleMonthChange({
                        target: { value },
                      } as React.ChangeEvent<HTMLSelectElement>)
                    }
                    value={selectedMonth.toString()}
                  >
                    <SelectTrigger className="w-[170px]">
                      <SelectValue placeholder="Select a month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {months.map((month) => (
                          <SelectItem
                            key={month.value}
                            value={month.value.toString()}
                          >
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <ComposedChart
                  data={enkoraFMIData}
                  barGap={0}
                  barCategoryGap="5%"
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("fi-FI")
                    }
                  />
                  <YAxis
                    label={{
                      value: "Kävijämäärä",
                      angle: -90,
                      position: "insideLeft",
                    }}
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
                                {chartConfig[name as keyof typeof chartConfig]
                                  ?.label || name}
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
                  {/* Stacked Bar for Ticket Types */}
                  <Bar
                    dataKey="kulkulupa"
                    stackId="a"
                    fill={chartConfig.kulkulupa.color}
                  />
                  <Bar
                    dataKey="ilmaiskavijat"
                    stackId="a"
                    fill={chartConfig.ilmaiskavijat.color}
                  />
                  <Bar
                    dataKey="paasyliput"
                    stackId="a"
                    fill={chartConfig.paasyliput.color}
                  />
                  <Bar
                    dataKey="kampanjakavijat"
                    stackId="a"
                    fill={chartConfig.kampanjakavijat.color}
                  />
                  <Bar
                    dataKey="verkkokauppa"
                    stackId="a"
                    fill={chartConfig.verkkokauppa.color}
                  />
                  <Bar
                    dataKey="vuosiliput"
                    stackId="a"
                    fill={chartConfig.vuosiliput.color}
                  />

                  {/* Separate Bars for Predictions */}
                  <Bar
                    dataKey="day1prediction"
                    fill={chartConfig.day1prediction.color}
                  />
                  <Bar
                    dataKey="day2prediction"
                    fill={chartConfig.day2prediction.color}
                  />
                  <Bar
                    dataKey="day3prediction"
                    fill={chartConfig.day3prediction.color}
                  />
                  <Bar
                    dataKey="day4prediction"
                    fill={chartConfig.day4prediction.color}
                  />

                  <Brush travellerWidth={20} stroke="#25582b" height={30} />
                </ComposedChart>
              </ChartContainer>
            </CardContent>
          </>
        ) : (
          <div className="p-48">
            {" "}
            <LoadingSpinner />
          </div>
        )}
      </Card>
    </section>
  );
}
