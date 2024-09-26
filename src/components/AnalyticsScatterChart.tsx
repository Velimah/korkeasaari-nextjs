import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface AnalyticsScatterChart {
    EnkoraFMIData2: Array<{
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
    }>;
    selectedYear: number;
    chartConfig: ChartConfig;
}

export default function AnalyticsScatterChart({ EnkoraFMIData2, selectedYear, chartConfig }: AnalyticsScatterChart) {

    const [selectedDataKey, setSelectedDataKey] = useState<string>("averageTemperature");

    return (

        <>
            <div className="py-4">
                <Select onValueChange={(value) => setSelectedDataKey(value)} value={selectedDataKey.toString()}>
                    <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder={selectedDataKey == "totalPrecipitation" ? "Sademäärä" : "Lämpötila"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="averageTemperature">Lämpötila</SelectItem>
                            <SelectItem value="totalPrecipitation">Sademäärä</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <Card className='dark:bg-slate-800 bg-secondary' >
                <CardHeader>
                    <CardTitle>Kävijämäärä / {selectedDataKey == "totalPrecipitation" ? "Sademäärä" : "Lämpötila"}</CardTitle>
                    <CardDescription>
                        {selectedYear}
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
                            <YAxis dataKey={selectedDataKey} type="number" name={selectedDataKey == "totalPrecipitation" ? "Sademäärä" : "Lämpötila"} unit={selectedDataKey == "totalPrecipitation" ? " mm" : "°C"} />
                            <Scatter name="Kävijät/Sade" data={EnkoraFMIData2} fill="#B14D97" stroke="black" />
                        </ScatterChart>
                    </ChartContainer>

                </CardContent>
            </Card>
        </>
    );
}