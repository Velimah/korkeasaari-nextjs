"use client"; // Ensure this component is treated as a client component

import { useEffect, useState } from "react";
import { ChartConfig } from "@/components/ui/chart";
import AnalyticsPieChart from "@/app/analytics/AnalyticsPieChart";
import AnalyticsScatterChart from "@/app/analytics/AnalyticsScatterChart";
import AnalyticsAnalyticsComposedChartChart from "@/app/analytics/AnalyticsComposedChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBLOBData, BLOB } from "@/hooks/fetchBLobData";

interface VisitorTotal {
  name: string;
  value: number;
  fill: string;
}

export default function EnkoraDataStatic() {
  const [EnkoraFMIData, setEnkoraFMIData] = useState<BLOB[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [visitorTotals, setVisitorTotals] = useState<VisitorTotal[]>([]);
  const [blobData, setBlobData] = useState<BLOB[]>([]);
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
    async function fetchBlobData() {
      const response = await getBLOBData();
      if ("error" in response) {
        console.error(response.error);
        return;
      }
      setBlobData(response);
      applyYearFilter(selectedYear, response); // Apply initial filter
    }
    fetchBlobData();
  }, []);

  function handleYearChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const year = Number(event.target.value);
    setSelectedYear(year);
    applyYearFilter(year, blobData);
  }

  function applyYearFilter(year: number, data: BLOB[]) {
    const filteredData =
      year === 0
        ? data
        : data.filter((item) => new Date(item.date).getFullYear() === year);

    setEnkoraFMIData(filteredData);
    calculateYearlyVisitors(filteredData);
  }

  // counts and sorts the total visitors for each category for the selected year/years
  function calculateYearlyVisitors(filteredData: BLOB[]) {
    const aggregatedData = [
      { name: "kulkulupa", value: 0, fill: "var(--color-kulkulupa)" },
      { name: "ilmaiskavijat", value: 0, fill: "var(--color-ilmaiskavijat)" },
      { name: "paasyliput", value: 0, fill: "var(--color-paasyliput)" },
      {
        name: "verkkokauppa",
        value: 0,
        fill: "var(--color-verkkokauppa)",
      },
      {
        name: "kampanjakavijat",
        value: 0,
        fill: "var(--color-kampanjakavijat)",
      },
      { name: "vuosiliput", value: 0, fill: "var(--color-vuosiliput)" },
    ];

    filteredData.forEach((item) => {
      aggregatedData[0].value += item.kulkulupa ?? 0;
      aggregatedData[1].value += item.ilmaiskavijat ?? 0;
      aggregatedData[2].value += item.paasyliput ?? 0;
      aggregatedData[3].value += item.verkkokauppa ?? 0;
      aggregatedData[4].value += item.kampanjakavijat ?? 0;
      aggregatedData[5].value += item.vuosiliput ?? 0;
    });

    // Sort aggregatedData by value (smallest first)
    aggregatedData.sort((a, b) => a.value - b.value);
    // Set the state with the sorted data
    setVisitorTotals(aggregatedData);
  }

  const chartConfig = {
    kulkulupa: {
      label: "Kulkulupa",
      color: "#000000",
    },
    ilmaiskavijat: {
      label: "Ilmaiskävijät",
      color: "#FF3B2F",
    },
    kampanjakavijat: {
      label: "Kampanjakävijät",
      color: "blue",
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
    totalvisitors: {
      label: "Kävijämäärä",
      color: "#FA9F42",
    },
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
      color: "rgba(110, 136, 148, 0.5)",
    },
  } satisfies ChartConfig;

  return (
    <section className="flex flex-col py-6">
      <Tabs defaultValue="composedchart" className="w-full">
        <div className="flex">
          <div className="mr-2">
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
                  <SelectItem key={year.value} value={year.value.toString()}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-grow">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="composedchart">Koostekaavio</TabsTrigger>
              <TabsTrigger value="scatterchart">Hajontakaavio</TabsTrigger>
              <TabsTrigger value="piechart">Kävijöiden jakauma</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <div>
          <TabsContent value="composedchart">
            <AnalyticsAnalyticsComposedChartChart
              EnkoraFMIData={EnkoraFMIData}
              selectedYear={selectedYear}
              chartConfig={chartConfig}
            />
          </TabsContent>
          <TabsContent value="scatterchart">
            <AnalyticsScatterChart
              EnkoraFMIData={EnkoraFMIData}
              selectedYear={selectedYear}
              chartConfig={chartConfig}
            />
          </TabsContent>
          <TabsContent value="piechart">
            <AnalyticsPieChart
              visitorTotals={visitorTotals}
              selectedYear={selectedYear}
              chartConfig={chartConfig}
            />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}
