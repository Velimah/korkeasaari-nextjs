"use client";  // Ensure this component is treated as a client component

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, LineChart } from 'recharts';
import { fetchVisitorData, YearlyData } from '../utils/visitorDataHook';

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

    // Utility function to format time as local time
    const formatTime = (timeString: string): string => {
      const date = new Date(timeString);
      return date.toLocaleString(); // Local date and time string
    };

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

// Define custom tooltip styles
const darkModeTooltipStyle = {
  backgroundColor: '#333',  // Dark background
  border: '1px solid #555',  // Slightly lighter border
  color: '#fff',             // White text
};

  return (
  <section className="space-y-3 text-center">
    <h2>Visitor Data Graph</h2>
    <div>
    <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={dailyTotals}
          margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString()} // Format date
          />
          <YAxis />
          <Tooltip contentStyle={darkModeTooltipStyle} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
            name="Daily Visitors"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </section>
  );
}
