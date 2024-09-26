"use client";  // Ensure this component is treated as a client component

import { useEffect, useState } from "react";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Bar, Brush, CartesianGrid, ComposedChart, Line, Pie, PieChart, Scatter, ScatterChart, XAxis, YAxis } from "recharts";
import EnkoraFMIData from "@/assets/FormattedVisitorFMI.json";
import AnalyticsPieChart from "./AnalyticsPieChart";
import AnalyticsScatterChart from "./AnalyticsScatterChart";
import AnalyticsAnalyticsComposedChartChart from "./AnalyticsComposedChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
interface DataItem {
    date: string;
    kulkulupa?: number;
    ilmaiskavijat?: number;
    paasyliput?: number;
    verkkokauppa_paasyliput?: number;
    kampanjakavijat?: number;
    vuosiliput?: number;
    total?: number;
    averageTemperature?: number | null;
    totalPrecipitation?: number;
}

export default function EnkoraDataStatic() {

    const years = [2019, 2020, 2021, 2022, 2023, 2024];
    const [selectedYear, setSelectedYear] = useState<number>(2024);

    const [EnkoraFMIData2, setEnkoraFMIData] = useState<DataItem[]>([]);
    const [visitorTotals, setVisitorTotals] = useState<any | null>(null);


    useEffect(() => {
        const filteredData = EnkoraFMIData.filter((item: DataItem) => {
            const itemYear = new Date(item.date).getFullYear(); // Extract the year from the date
            return itemYear === selectedYear;
        });

        setEnkoraFMIData(filteredData); // Update state with filtered data
        processWeatherData(filteredData);
    }, []); // Empty dependency array ensures this runs only once when the component mounts

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
        verkkokauppa_paasyliput: {
            label: "Verkkokauppa Pääsyliput",
            color: "#25582b",
        },
        vuosiliput: {
            label: "Vuosiliput",
            color: "#B14D97",
        },
        total: {
            label: "Kävijämäärä",
            color: "#25582b",
        },
        averageTemperature: {
            label: "Keskimääräinen Lämpötila",
            color: "#AAC929",
        },
        weightedTotal: {
            label: "testiarvo",
            color: "#FF3B2F",
        },
    } satisfies ChartConfig

    function processWeatherData(filteredData: DataItem[]) {
        const aggregatedData = [
            { name: "kulkulupa", value: 0, fill: "var(--color-kulkulupa)" },
            { name: "ilmaiskavijat", value: 0, fill: "var(--color-ilmaiskavijat)" },
            { name: "paasyliput", value: 0, fill: "var(--color-paasyliput)" },
            { name: "verkkokauppa_paasyliput", value: 0, fill: "var(--color-verkkokauppa_paasyliput)" },
            { name: "kampanjakavijat", value: 0, fill: "var(--color-kampanjakavijat)" },
            { name: "vuosiliput", value: 0, fill: "var(--color-vuosiliput)" },
        ];

        filteredData.forEach((item: { kulkulupa?: number; ilmaiskavijat?: number; paasyliput?: number; verkkokauppa_paasyliput?: number; kampanjakavijat?: number; vuosiliput?: number; }) => {
            aggregatedData[0].value += item.kulkulupa || 0;
            aggregatedData[1].value += item.ilmaiskavijat || 0;
            aggregatedData[2].value += item.paasyliput || 0;
            aggregatedData[3].value += item.verkkokauppa_paasyliput || 0;
            aggregatedData[4].value += item.kampanjakavijat || 0;
            aggregatedData[5].value += item.vuosiliput || 0;
        });

        // Sort aggregatedData by value (smallest first)
        aggregatedData.sort((a, b) => a.value - b.value);
        console.log('aggregatedData', aggregatedData);
        // Set the state with the sorted data
        setVisitorTotals(aggregatedData);
    }

    function handleYearChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedYear = Number(event.target.value); // Get the selected year from the event

        // Filter data based on the selected year
        const filteredData = EnkoraFMIData.filter((item: DataItem) => {
            const itemYear = new Date(item.date).getFullYear(); // Extract the year from the date
            return itemYear === selectedYear;
        });

        setEnkoraFMIData(filteredData); // Update state with filtered data
        setSelectedYear(selectedYear); // Update the selected year state
        processWeatherData(filteredData); // Process the weather data for the filtered year
    }

    return (
        <section className="flex">

            <Tabs defaultValue="composedchart" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="composedchart">Composed Chart</TabsTrigger>
                    <TabsTrigger value="scatterchart">Scatter Chart</TabsTrigger>
                    <TabsTrigger value="piechart">Pie Chart</TabsTrigger>
                </TabsList>

                <div className="pt-10">
                    <Select onValueChange={(value) => handleYearChange({ target: { value } } as React.ChangeEvent<HTMLSelectElement>)} value={selectedYear.toString()}>
                        <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Select a year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <TabsContent value="composedchart">
                    <AnalyticsAnalyticsComposedChartChart EnkoraFMIData2={EnkoraFMIData2} selectedYear={selectedYear} chartConfig={chartConfig} />
                </TabsContent>
                <TabsContent value="scatterchart">
                    <AnalyticsScatterChart EnkoraFMIData2={EnkoraFMIData2} selectedYear={selectedYear} chartConfig={chartConfig} />
                </TabsContent>
                <TabsContent value="piechart">
                    <AnalyticsPieChart visitorTotals={visitorTotals} selectedYear={selectedYear} chartConfig={chartConfig} />
                </TabsContent>
            </Tabs>

        </section >
    );
}