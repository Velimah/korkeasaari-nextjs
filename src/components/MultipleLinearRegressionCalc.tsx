"use client";
import EnkoraFMIData from "@/assets/FormattedEnkoraFMI.json";
import MultivariateLinearRegression from 'ml-regression-multivariate-linear';
import { useEffect, useState } from "react";

export default function LinearRegression(weatherData: any) {

  const [predictedVisitors, setPredictedVisitors] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [precipitation, setPrecipitation] = useState<number>(0);
  const [averages, setAverages] = useState<{ avgTemp: number; avgPrecipitation: number } | null>(null);

  function getAverages(weatherData: any): { avgTemp: number; avgPrecipitation: number } | null {
    // Filter data for the 10th to the 20th of each month
  const filteredData = weatherData.weatherData.filter((entry: { time: string; temperature: number; precipitation: number }) => {
       const date = new Date(entry.time);
    const hour = date.getUTCHours();
    return hour >= 10 && hour <= 20;
  });

  if (filteredData.length === 0) {
    return null;  // No data in the range
  }

  // Calculate averages
  const totalTemp = filteredData.reduce((acc: number, entry: { time: string; temperature: number; precipitation: number }) => acc + entry.temperature, 0);
  const totalPrecipitation = filteredData.reduce((acc: number, entry: { time: string; temperature: number; precipitation: number }) => acc + entry.precipitation, 0);
    console.log('Total precipitation:', totalPrecipitation);
    console.log('Total temperature:', totalTemp);
  const avgTemp = totalTemp / filteredData.length;
  const avgPrecipitation = totalPrecipitation / filteredData.length;

  return {
    avgTemp,
    avgPrecipitation
  };
  }


  useEffect(() => {
  const vittu = getAverages(weatherData);
  setAverages(vittu);
  console.log('Averages:', averages);
   
    console.log('Weather data:', weatherData);
    setTemperature(weatherData.weatherData[0].temperature);
    setPrecipitation(weatherData.weatherData[0].precipitation);

    const monthlyData: number[][][] = Array.from({ length: 12 }, () => []); // Create 12 empty arrays for each month
    const monthlyData2: number[][][] = Array.from({ length: 12 }, () => []); // Create 12 empty arrays for each month

    EnkoraFMIData.forEach(({ averageTemperature, totalPrecipitation, date }) => {
      // Create a Date object from the date string
      const month = new Date(date).getMonth(); // Get month index (0 for January, 11 for December)

      // Push the values into the appropriate array for the month
      monthlyData[month].push([
        averageTemperature ?? 0, // Default to 0 if null/undefined
        totalPrecipitation ?? 0,  // Default to 0 if null/undefined
      ]);
    });

    const weekdayVisitorCounts: number[] = Array.from({ length: 12 }, () => 0); // Track weekday visitors for each month
    const weekendVisitorCounts: number[] = Array.from({ length: 12 }, () => 0); // Track weekend visitors for each month
    const weekdayCount: number[] = Array.from({ length: 12 }, () => 0); // Count of weekdays for each month
    const weekendCount: number[] = Array.from({ length: 12 }, () => 0); // Count of weekends for each month

    EnkoraFMIData.forEach(({ date, total }) => {
      // Create a Date object from the date string
      const dateObj = new Date(date);
      const month = dateObj.getMonth(); // Get month index (0 for January, 11 for December)
      const dayOfWeek = dateObj.getDay(); // Get day of the week (0 for Sunday, 6 for Saturday)

      if (dayOfWeek === 0 || dayOfWeek === 6) { // If it's Saturday (6) or Sunday (0)
        weekendVisitorCounts[month] += total ?? 0; // Add to weekend visitor count
        weekendCount[month] += 1; // Increment weekend count
      } else { // If it's a weekday (Monday to Friday)
        weekdayVisitorCounts[month] += total ?? 0; // Add to weekday visitor count
        weekdayCount[month] += 1; // Increment weekday count
      }

      // Push the values into the appropriate array for the month
      monthlyData2[month].push([
        total ?? 0, // Default to 0 if null/undefined
        dayOfWeek,  // Store the day of the week
      ]);
    });

    const weightedTotalWeekday = weekdayVisitorCounts[10] / weekdayCount[10];
    const weightedTotalWeekend = weekendVisitorCounts[10] / weekendCount[10];
    const weightendresult = weightedTotalWeekend / weightedTotalWeekday;
    console.log('Weight for weekends:', weightendresult);


    const regression = new MultivariateLinearRegression(monthlyData[10], monthlyData2[10]);
    const result = regression.predict([weatherData.weatherData[0].temperature, weatherData.weatherData[0].precipitation])[0];
      const result2 = result * weightendresult;
      setPredictedVisitors(result);

      console.log('Prediction:', predictedVisitors);

        console.log('Prediction weekday:', result);
    console.log('Prediction weekend:', result2);


    }, []); // Empty dependency array ensures this runs only once after the initial render

    return (
        <div className="p-6">
        <h1>Multiple Linear Regression</h1>
        <p>Lämpötila nyt: {temperature} C</p>
        <p>Sademäärä nyt: {precipitation} mm</p>
        <p>Kävijämääräennuste: {predictedVisitors.toFixed(0)} Kävijää</p>
        </div>
    );
}

