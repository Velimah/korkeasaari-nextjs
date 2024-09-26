"use client";  // Ensure this component is treated as a client component

import { useEffect, useState } from "react";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Bar, Brush, CartesianGrid, ComposedChart, Line, Pie, PieChart, Scatter, ScatterChart, XAxis, YAxis } from "recharts";
import EnkoraFMIData from "@/assets/FormattedVisitorFMI.json";

export default function EnkoraDataStatic() {

    const [startDate, setStartDate] = useState<string>('2019-01-01');
    const [endDate, setEndDate] = useState<string>('2024-09-25');
    const [EnkoraFMIData2, setEnkoraFMIData] = useState<any | null>(EnkoraFMIData);
    const [visitorTotals, setVisitorTotals] = useState<any | null>(null);

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

    useEffect(() => {
        processWeatherData();
        console.log('Processed data:', visitorTotals);
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    function processWeatherData() {
        const aggregatedData = [
            { name: "kulkulupa", value: 0, fill: "var(--color-kulkulupa)" },
            { name: "ilmaiskavijat", value: 0, fill: "var(--color-ilmaiskavijat)" },
            { name: "paasyliput", value: 0, fill: "var(--color-paasyliput)" },
            { name: "verkkokauppa_paasyliput", value: 0, fill: "var(--color-verkkokauppa_paasyliput)" },
            { name: "kampanjakavijat", value: 0, fill: "var(--color-kampanjakavijat)" },
            { name: "vuosiliput", value: 0, fill: "var(--color-vuosiliput)" },
        ];

        EnkoraFMIData2.forEach((item: { kulkulupa?: number; ilmaiskavijat?: number; paasyliput?: number; verkkokauppa_paasyliput?: number; kampanjakavijat?: number; vuosiliput?: number; }) => {
            aggregatedData[0].value += item.kulkulupa || 0;
            aggregatedData[1].value += item.ilmaiskavijat || 0;
            aggregatedData[2].value += item.paasyliput || 0;
            aggregatedData[3].value += item.verkkokauppa_paasyliput || 0;
            aggregatedData[4].value += item.kampanjakavijat || 0;
            aggregatedData[5].value += item.vuosiliput || 0;
        });

        // Sort aggregatedData by value (smallest first)
        aggregatedData.sort((a, b) => a.value - b.value);

        // Set the state with the sorted data
        setVisitorTotals(aggregatedData);
    }


    console.log('Processed data:', visitorTotals);

    if (!EnkoraFMIData2) {
        return <p>Loading...</p>;
    }

    return (
        <section className="m-6 text-center">

            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Kävijöiden jakauma lipputyypin mukaan</CardTitle>
                    <CardDescription>2019 - 2024</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[400px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie data={visitorTotals} dataKey="value" nameKey="name" startAngle={90} endAngle={450} />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div className="p-6">
                <Card className='dark:bg-slate-800 bg-secondary' >
                    <CardHeader>
                        <CardTitle>Kävijämäärät ja Keskilämpötila 2019-2024</CardTitle>
                        <CardDescription>
                            {new Date(startDate).toLocaleDateString('fi-FI')} - {new Date(endDate).toLocaleDateString('fi-FI')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[400px] w-full">
                            <ComposedChart accessibilityLayer data={EnkoraFMIData2}>
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
                                            formatter={(value, name) => (
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
                                                </>
                                            )}
                                        />
                                    }
                                    cursor={true}
                                    defaultIndex={1}
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    label={{ value: 'Kävijämäärä', angle: 90, position: 'insideRight' }}
                                />
                                <YAxis
                                    yAxisId="left"
                                    domain={[
                                        (dataMin: number) => Math.floor(dataMin - 2),
                                        (dataMax: number) => Math.ceil(dataMax + 2),
                                    ]}
                                    label={{ value: 'Lämpötila (°C)', angle: -90, position: 'insideLeft' }}
                                />
                                <Bar
                                    dataKey="total"
                                    yAxisId="right"
                                    stackId="a"
                                    fill="var(--color-total)"
                                    radius={[0, 0, 0, 0]}
                                />
                                <Line
                                    yAxisId="left"
                                    dataKey="averageTemperature"
                                    type="natural"
                                    stroke="var(--color-averageTemperature)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Brush travellerWidth={20} stroke="#25582b" height={30} />
                            </ComposedChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="p-6">
                <Card className='dark:bg-slate-800 bg-secondary' >
                    <CardHeader>
                        <CardTitle>Kävijämäärät Lämpötilaan Suhteutettuna</CardTitle>
                        <CardDescription>
                            {new Date(startDate).toLocaleDateString('fi-FI')} - {new Date(endDate).toLocaleDateString('fi-FI')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[400px] w-full">
                            <ScatterChart accessibilityLayer data={EnkoraFMIData2}>
                                <CartesianGrid vertical={false} />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            // Access the 'payload' to get the full data object, including the 'date'
                                            labelFormatter={(_, payload) => {
                                                const dataPoint = payload && payload[0] ? payload[0].payload : null;
                                                if (dataPoint) {
                                                    return new Date(dataPoint.date).toLocaleDateString("fi-FI", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    });
                                                }
                                                return "";
                                            }}
                                            formatter={(value, name) => (
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
                                                </>
                                            )}
                                        />
                                    }
                                    cursor={true}
                                    defaultIndex={1}
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                                <XAxis dataKey="total" type="number" name="Kävijämäärä" />
                                <YAxis dataKey="averageTemperature" type="number" name="Keskilämpötila" unit=" (°C)" />
                                <Scatter name="Kävijät/Lämpötila" fill="#AAC929" stroke="black" />
                            </ScatterChart>
                        </ChartContainer>

                    </CardContent>
                </Card>
            </div>

            <div className="p-6">
                <Card className='dark:bg-slate-800 bg-secondary' >
                    <CardHeader>
                        <CardTitle>Kävijämäärät Sademäärään Suhteutettuna</CardTitle>
                        <CardDescription>
                            {new Date(startDate).toLocaleDateString('fi-FI')} - {new Date(endDate).toLocaleDateString('fi-FI')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[400px] w-full">
                            <ScatterChart accessibilityLayer data={EnkoraFMIData2}>
                                <CartesianGrid vertical={false} />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            // Access the 'payload' to get the full data object, including the 'date'
                                            labelFormatter={(_, payload) => {
                                                const dataPoint = payload && payload[0] ? payload[0].payload : null;
                                                if (dataPoint) {
                                                    return new Date(dataPoint.date).toLocaleDateString("fi-FI", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    });
                                                }
                                                return "";
                                            }}
                                            formatter={(value, name) => (
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
                                                </>
                                            )}
                                        />
                                    }
                                    cursor={true}
                                    defaultIndex={1}
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                                <XAxis dataKey="total" type="number" name="Kävijämäärä" />
                                <YAxis dataKey="totalPrecipitation" type="number" name="Sademäärä" unit=" mm" />
                                <Scatter name="Kävijät/Sade" data={EnkoraFMIData2} fill="#B14D97" stroke="black" />
                            </ScatterChart>
                        </ChartContainer>

                    </CardContent>
                </Card>
            </div>

        </section >
    );
}