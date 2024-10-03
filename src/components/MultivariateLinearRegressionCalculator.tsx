"use client";
import EnkoraFMIData from "@/assets/FormattedEnkoraFMI.json";
import MultivariateLinearRegression from 'ml-regression-multivariate-linear';
import { useEffect, useState } from "react";
import { WeatherData as WeatherDataType } from '@/utils/fetchFMIForecastData';

export default function MultivariateLinearRegressionCalculator({ weatherData }: { weatherData: WeatherDataType[] }) {

    const [predictedVisitors, setPredictedVisitors] = useState<number>(0);
    const [temperature, setTemperature] = useState<number>(0);
    const [precipitation, setPrecipitation] = useState<number>(0);
    const [averages, setAverages] = useState<{ date: any; avgTemperature: number; avgPrecipitation: number }[] | null>(null);

    useEffect(() => {
        const averageWeatherData = getAveragesFromForecast(weatherData);
        setAverages(averageWeatherData);

        const monthlyDataWeather: number[][][] = Array.from({ length: 12 }, () => []); // Create 12 empty arrays for each month
        const monthlyDataVisitors: number[][][] = Array.from({ length: 12 }, () => []); // Create 12 empty arrays for each month
        const weekdayVisitorCounts: number[] = Array.from({ length: 12 }, () => 0); // Track weekday visitors for each month
        const weekendVisitorCounts: number[] = Array.from({ length: 12 }, () => 0); // Track weekend visitors for each month
        const weekdayCount: number[] = Array.from({ length: 12 }, () => 0); // Count of weekdays for each month
        const weekendCount: number[] = Array.from({ length: 12 }, () => 0); // Count of weekends for each month

        function getAveragesFromForecast(weatherData: WeatherDataType[]) {

            const filteredData = weatherData.filter((entry: WeatherDataType) => {
                const date = new Date(entry.time);
                const hour = date.getUTCHours();
                return hour >= 10 && hour <= 20;
            });

            if (filteredData.length === 0) {
                return null;  // No data in the range
            }

            const groupedDataByDay = filteredData.reduce((acc: any, entry: { time: string; temperature: number; precipitation: number }) => {
                const date = entry.time.split('T')[0]; // Assuming 'time' is in ISO format, extract the date part

                if (!acc[date]) {
                    acc[date] = {
                        date,
                        totalTemperature: 0,
                        totalPrecipitation: 0,
                        count: 0, // To track how many entries per day for averaging
                    };
                }

                acc[date].totalTemperature += entry.temperature;
                acc[date].totalPrecipitation += entry.precipitation;
                acc[date].count += 1;

                return acc;
            }, {});

            const result = Object.values(groupedDataByDay).map((day: any) => ({
                date: day.date,
                avgTemperature: day.totalTemperature / day.count,
                avgPrecipitation: day.totalPrecipitation / day.count,
            }));

            console.log('Grouped data by day:', result);
            return result;
        }

        EnkoraFMIData.forEach(({ averageTemperature, totalPrecipitation, date }) => {
            // Create a Date object from the date string
            const month = new Date(date).getMonth(); // Get month index (0 for January, 11 for December)

            // Push the values into the appropriate array for the month
            monthlyDataWeather[month].push([
                averageTemperature ?? 0, // Default to 0 if null/undefined
                totalPrecipitation ?? 0,  // Default to 0 if null/undefined
            ]);
        });

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
            monthlyDataVisitors[month].push([
                total ?? 0, // Default to 0 if null/undefined
                dayOfWeek,  // Store the day of the week
            ]);
        });

        const weightedTotalWeekday = weekdayVisitorCounts[10] / weekdayCount[10];
        const weightedTotalWeekend = weekendVisitorCounts[10] / weekendCount[10];
        const weightendresult = weightedTotalWeekend / weightedTotalWeekday;


        const regression = new MultivariateLinearRegression(monthlyDataWeather[10], monthlyDataVisitors[10]);

        const result = regression.predict([weatherData[0].temperature, weatherData[0].precipitation])[0];
        const result2 = result * weightendresult;
        setPredictedVisitors(result);

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

