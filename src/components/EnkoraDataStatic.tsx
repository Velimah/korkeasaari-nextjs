"use client";  // Ensure this component is treated as a client component

import { useState } from "react";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Bar, Brush, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts";
import EnkoraVisitorData from "../assets/EnkoraData.json";

export default function EnkoraDataStatic() {

    const [startDate, setStartDate] = useState<string>('2019-01-01');
    const [endDate, setEndDate] = useState<string>('2024-09-25');

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
            color: "#AAC929",
        }
    } satisfies ChartConfig

    if (!EnkoraVisitorData) {
        return <p>Loading...</p>;
    }

    return (
        <section className="m-6 text-center">
            {/* Add the Card component here
            <div>
                <Card className='dark:bg-slate-800 bg-secondary' >
                    <CardHeader>
                        <CardTitle>Korkeasaaren Kävijämäärät 2019-2024</CardTitle>
                        <CardDescription>
                            {new Date(startDate).toLocaleDateString('fi-FI')} - {new Date(endDate).toLocaleDateString('fi-FI')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[400px] w-full">
                            <ComposedChart accessibilityLayer data={EnkoraVisitorData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="day"
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
                                                                {item.payload.ilmaiskavijat + item.payload.paasyliput + item.payload.verkkokauppa_paasyliput + item.payload.vuosiliput}
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
                                    dataKey="kulkulupa"
                                    stackId="a"
                                    fill="var(--color-kulkulupa)"
                                    radius={[0, 0, 0, 0]}
                                />
                                <Bar
                                    dataKey="ilmaiskavijat"
                                    stackId="a"
                                    fill="var(--color-ilmaiskavijat)"
                                    radius={[0, 0, 0, 0]}
                                />
                                <Bar
                                    dataKey="vuosiliput"
                                    stackId="a"
                                    fill="var(--color-vuosiliput)"
                                    radius={[0, 0, 0, 0]}
                                />
                                <Bar
                                    dataKey="verkkokauppa_paasyliput"
                                    stackId="a"
                                    fill="var(--color-verkkokauppa_paasyliput)"
                                    radius={[0, 0, 0, 0]}
                                />
                                <Bar
                                    dataKey="paasyliput"
                                    stackId="a"
                                    fill="var(--color-paasyliput)"
                                    radius={[0, 0, 0, 0]}
                                />
                                <Brush travellerWidth={20} stroke="#25582b" height={30} />
                            </ComposedChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

            </div>
            */}

            <div>
                <Card className='dark:bg-slate-800 bg-secondary' >
                    <CardHeader>
                        <CardTitle>Korkeasaaren Kävijämäärät 2019-2024</CardTitle>
                        <CardDescription>
                            {new Date(startDate).toLocaleDateString('fi-FI')} - {new Date(endDate).toLocaleDateString('fi-FI')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[400px] w-full">
                            <ComposedChart accessibilityLayer data={EnkoraVisitorData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="day"
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
                                    label={{ value: 'Kävijämäärä', angle: -90, position: 'insideLeft' }} />
                                <Bar
                                    dataKey="total"
                                    stackId="a"
                                    fill="var(--color-total)"
                                    radius={[0, 0, 0, 0]}
                                />
                                <Brush travellerWidth={20} stroke="#25582b" height={30} />
                            </ComposedChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}