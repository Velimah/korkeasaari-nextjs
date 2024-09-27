import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Bar, Brush, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

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

export default function AnalyticsAnalyticsComposedChartChart({ EnkoraFMIData2, selectedYear, chartConfig }: AnalyticsScatterChart) {

    return (
        <Card className='dark:bg-slate-800 bg-secondary' >
            <CardHeader>
                <CardTitle>Kävijämäärät ja Keskilämpötila</CardTitle>
                <CardDescription>
                    {selectedYear}
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
                                            month: "short",
                                            year: "numeric",
                                            weekday: "short",
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
    );
}