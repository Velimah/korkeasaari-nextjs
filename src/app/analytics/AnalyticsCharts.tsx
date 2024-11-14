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
  const [blobData, setBlobData] = useState<BLOB[]>([]);
  useEffect(() => {
    async function fetchBlobData() {
      const data = await getBLOBData();
      setBlobData(data);
      console.log('BLOB:', data);
    }
    fetchBlobData();
  }, []);

  const [EnkoraFMIData, setEnkoraFMIData] = useState<BLOB[]>([]);
  const years = [0, 2019, 2020, 2021, 2022, 2023, 2024];
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [visitorTotals, setVisitorTotals] = useState<VisitorTotal[]>([]);


  useEffect(() => {
    const filteredData = blobData.filter((item: BLOB) => {
      const itemYear = new Date(item.date).getFullYear(); // Extract the year from the date
      return itemYear === selectedYear;
    });
    setEnkoraFMIData(filteredData); // Update state with filtered data
    calculateYearlyVisitors(filteredData);
  }, []);

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

  function handleYearChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedYear = Number(event.target.value); // Get the selected year from the event
    let filteredData;

    if (selectedYear === 0) {
      // If the selected year is 0, skip filtering and use the full data set
      filteredData = blobData;
    } else {
      // Filter data based on the selected year
      filteredData = blobData.filter((item: BLOB) => {
        const itemYear = new Date(item.date).getFullYear(); // Extract the year from the date
        return itemYear === selectedYear;
      });
    }
    setEnkoraFMIData(filteredData); // Update state with filtered data
    setSelectedYear(selectedYear); // Update the selected year state
    calculateYearlyVisitors(filteredData); // Calculate the total visitors for the selected year
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
      color: "#25582b",
    },
    temperature: {
      label: "Keskimääräinen Lämpötila",
      color: "#AAC929",
    },
  } satisfies ChartConfig;

  return (
    <section className="flex flex-col">
      <Tabs defaultValue="composedchart" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="composedchart">Composed Chart</TabsTrigger>
          <TabsTrigger value="scatterchart">Scatter Chart</TabsTrigger>
          <TabsTrigger value="piechart">Pie Chart</TabsTrigger>
        </TabsList>

        <div className="pt-10">
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
                  <SelectItem key={year} value={year.toString()}>
                    {year === 0 ? "Kaikki vuodet" : year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

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
      </Tabs>
    </section>
  );
}
