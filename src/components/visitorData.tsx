"use client";  // Ensure this component is treated as a client component

import React, { useEffect, useState } from 'react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { fetchVisitorData, YearlyData } from '../utils/visitorDataHook';
import { H2 } from './ui/H2';

export default function VisitorData() {
    const [visitorData, setVisitorData] = useState<any | null>(null);
  
    // Fetch weather data on client side
    useEffect(() => {
      async function fetchData() {
        try {
          const data = await fetchVisitorData();
          setVisitorData(data);
          console.log ('Visitor data:', data);
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
  console.log('Daily Totals:', dailyTotals);

    if (!dailyTotals) {
    return <p>Loading...</p>;
  }

  return (
    <section className="py-6 px-6 text-center">
      <H2>Visitor Count 2024</H2>
      <div>
      <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={dailyTotals}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString()} // Format date
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              type="monotone" 
              dataKey="total" 
              stroke="#8884d8"
              name="Daily Visitors"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
