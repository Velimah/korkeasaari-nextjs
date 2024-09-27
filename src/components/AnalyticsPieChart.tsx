"use client";  // Ensure this component is treated as a client component

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Pie, PieChart } from "recharts";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface AnalyticsPieChartProps {
    visitorTotals: Array<{ name: string; value: number }>;
    selectedYear: number;
    chartConfig: ChartConfig;
}

export default function AnalyticsPieChart({ visitorTotals, selectedYear, chartConfig }: AnalyticsPieChartProps) {

    return (
            <Card className='dark:bg-slate-800 bg-secondary' >
                <CardHeader className="items-center pb-0">
                    <CardTitle>Kävijöiden jakauma lipputyypin mukaan</CardTitle>
                    <CardDescription>{selectedYear}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="h-[400px] w-full"
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
    );
}