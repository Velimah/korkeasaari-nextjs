"use client";  // Ensure this component is treated as a client component

import React, { useEffect, useState } from 'react';
import { Bar, XAxis, YAxis, CartesianGrid, ComposedChart, Brush } from 'recharts';
import { fetchVisitorData, YearlyData } from '../utils/visitorDataHook';
import { H2 } from './ui/H2';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"

export default function VisitorData() {
  const [visitorData, setVisitorData] = useState<any | null>(null);

  // Fetch weather data on client side
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchVisitorData();
        setVisitorData(data);
      } catch (error) {
        console.error('Error fetching visitor data:', error);
      }
    }
    fetchData();
  }, []);

  function getDailyTotals(yearlyData: YearlyData): { date: string; total: number }[] {
    const dailyTotals: { date: string; total: number }[] = [];

    yearlyData.months.forEach(month => {
      month.days.forEach(day => {
        // Create a date string in format 'YYYY-MM-DD'
        const date = `${yearlyData.year}-${String(month.month + 1).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
        dailyTotals.push({ date, total: day.total });
      });
    });
    return dailyTotals;
  }

  // Convert the data for the chart
  const dailyTotals = visitorData ? getDailyTotals(visitorData) : [];

  if (!dailyTotals) {
    return <p>Loading...</p>;
  }

  const chartConfig = {
    total: {
      label: "Visitors",
      color: "#aac929",
    },
  } satisfies ChartConfig

  return (
    <section className="py-6 px-6 text-center">
      <H2>Visitor Count 2024</H2>
      <div>

        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ComposedChart accessibilityLayer data={dailyTotals}>
            <CartesianGrid vertical={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              label={{ value: 'Visitors', angle: -90, position: 'insideLeft' }}
            />
            <Bar
              yAxisId="left"
              dataKey="total"
              fill="var(--color-total)"
              radius={4}
            />
            <Brush />
          </ComposedChart>
        </ChartContainer>

      </div>
    </section>
  );
}
