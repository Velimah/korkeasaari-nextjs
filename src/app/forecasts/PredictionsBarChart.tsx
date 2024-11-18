import React, { useEffect, useState } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Brush, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getBLOBData, BLOB } from "@/hooks/fetchBLobData";
import { getVisitorPredictions } from "@/hooks/UpdateVisitorPrediction";
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
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMonth, setSelectedMonth] = useState<number>(11); // 0 means "all months"
  const months = [
    { label: "Kaikki kuukaudet", value: 0 },
    { label: "Tammikuu", value: 1 },
    { label: "Helmikuu", value: 2 },
    { label: "Maaliskuu", value: 3 },
    { label: "Huhtikuu", value: 4 },
    { label: "Toukokuu", value: 5 },
    { label: "Kesäkuu", value: 6 },
    { label: "Heinäkuu", value: 7 },
    { label: "Eolokuu", value: 8 },
    { label: "Syyskuu", value: 9 },
    { label: "Lokakuu", value: 10 },
    { label: "Marraskuu", value: 11 },
    { label: "Joulukuu", value: 12 },
  ];
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
    async function fetchData() {
      const blobResponse = await getBLOBData();
      const predictionResponse = await getVisitorPredictions();
      console.log("predictionResponse", predictionResponse);

      if ("error" in blobResponse || "error" in predictionResponse) {
        console.error("Error fetching data");
        return;
      }

      // Merge BLOB and Prediction data by date
      const mergedData = blobResponse.map((blob) => ({
        ...blob,
        ...predictionResponse.find((pred) => pred.date === blob.date),
      }));

      setBlobData(mergedData);
      applyFilters(selectedYear, selectedMonth, mergedData);
    }
    fetchData();
  }, []);

  const chartConfig = {
    kulkulupa: { label: "Kulkulupa", color: "#000000" },
    ilmaiskavijat: { label: "Ilmaiskävijät", color: "#FF3B2F" },
    paasyliput: { label: "Pääsyliput", color: "#AAC929" },
    kampanjakavijat: { label: "Kampanjakävijät", color: "blue" },
    verkkokauppa: { label: "Verkkokauppa Pääsyliput", color: "#25582b" },
    vuosiliput: { label: "Vuosiliput", color: "#B14D97" },
    day1prediction: { label: "Päivän 1 ennuste", color: "#FFB3B3" },
    day2prediction: { label: "Päivän 2 ennuste", color: "#C3E88D" },
    day3prediction: { label: "Päivän 3 ennuste", color: "#82CFFA" },
    day4prediction: { label: "Päivän 4 ennuste", color: "#FFEE99" },
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
    const filteredByYear = year === 0 ? data : data.filter((item) => new Date(item.date).getFullYear() === year);
    const filteredByMonth = month === 0 ? filteredByYear : filteredByYear.filter((item) => new Date(item.date).getMonth() + 1 === month);

    setEnkoraFMIData(filteredByMonth);
  }

  return (
    <section className="m-6 text-center">

      <div className='py-4 gap-4 flex'>
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
        <Select
          onValueChange={(value) => handleMonthChange({ target: { value } } as React.ChangeEvent<HTMLSelectElement>)}
          value={selectedMonth.toString()}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a month" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Card>
        {enkoraFMIData && enkoraFMIData.length > 0 ?
          <>
            <CardHeader>
              <CardTitle>Korkeasaaren Kävijämääräennusteet</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <ComposedChart data={enkoraFMIData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("fi-FI")
                    }
                  />
                  <YAxis />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) =>
                          new Date(value).toLocaleDateString("fi-FI")
                        }
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />

                  {/* Stacked Bar for Ticket Types */}
                  <Bar dataKey="kulkulupa" stackId="a" fill={chartConfig.kulkulupa.color} />
                  <Bar dataKey="ilmaiskavijat" stackId="a" fill={chartConfig.ilmaiskavijat.color} />
                  <Bar dataKey="paasyliput" stackId="a" fill={chartConfig.paasyliput.color} />
                  <Bar dataKey="kampanjakavijat" stackId="a" fill={chartConfig.kampanjakavijat.color} />
                  <Bar dataKey="verkkokauppa" stackId="a" fill={chartConfig.verkkokauppa.color} />
                  <Bar dataKey="vuosiliput" stackId="a" fill={chartConfig.vuosiliput.color} />

                  {/* Separate Bars for Predictions */}
                  <Bar dataKey="day1prediction" fill={chartConfig.day1prediction.color} />
                  <Bar dataKey="day2prediction" fill={chartConfig.day2prediction.color} />
                  <Bar dataKey="day3prediction" fill={chartConfig.day3prediction.color} />
                  <Bar dataKey="day4prediction" fill={chartConfig.day4prediction.color} />

                  <Brush travellerWidth={20} stroke="#25582b" height={30} />
                </ComposedChart>
              </ChartContainer>
            </CardContent>
          </>
          : <div className="p-48"> <LoadingSpinner /></div>}
      </Card>
    </section>
  );
}
