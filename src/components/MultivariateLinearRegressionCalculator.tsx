"use client";
import EnkoraFMIData from "@/assets/FormattedEnkoraFMI.json";
import MultivariateLinearRegression from 'ml-regression-multivariate-linear';
import { useEffect, useState } from "react";
import { WeatherData as WeatherDataType } from '@/utils/fetchFMIForecastData';

interface PredictionResults {
    date: string;
    temperature: number;
    precipitation: number;
    predictedVisitors: number;
}

export default function MultivariateLinearRegressionCalculator({ weatherData }: { weatherData: WeatherDataType[] }) {

    const [predictionResults, setPredictionresults] = useState<PredictionResults[]>();

    const monthlyDataWeather: number[][][] = Array.from({ length: 12 }, () => []); // Create 12 empty arrays for each month
    const monthlyDataVisitors: number[][][] = Array.from({ length: 12 }, () => []); // Create 12 empty arrays for each month
    const weekdayVisitorCounts: number[] = Array.from({ length: 12 }, () => 0); // Track weekday visitors for each month
    const weekendVisitorCounts: number[] = Array.from({ length: 12 }, () => 0); // Track weekend visitors for each month
    const weekdayCount: number[] = Array.from({ length: 12 }, () => 0); // Count of weekdays for each month
    const weekendCount: number[] = Array.from({ length: 12 }, () => 0); // Count of weekends for each month

    function getAveragesFromForecast(weatherData: WeatherDataType[]) {

        // Filter data to include times between 10:00 and 20:00
        const filteredData = weatherData.filter((entry: WeatherDataType) => {
            const date = new Date(entry.time);
            const hour = date.getUTCHours();
            return hour >= 10 && hour <= 20;
        });

        // group the data by day and add together the temperature, precipitation and count the entries
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

        // Calculate the average temperature and total precipitation for each day
        const result = Object.values(groupedDataByDay).map((date: any) => ({
            date: date.date,
            avgTemperature: date.totalTemperature / date.count,
            avgPrecipitation: date.totalPrecipitation,
        }));

        //return array of objects with date, average temperature and total precipitation
        return result;
    }

    // Function to predict visitor counts using the multivariate linear regression model
    function PredictVisitorCounts() {
        // Get the average weather forecast data for each day
        const averageWeatherData = getAveragesFromForecast(weatherData);
        const predictions = [];

        //loop through the average weather forecast data for each day and predict the visitor counts
        for (let i = 0; i < averageWeatherData.length; i++) {
            const dateObject = new Date(averageWeatherData[i].date);
            const month = dateObject.getMonth() + 1; // Get month index (0 for January, 11 for December)

            // Create a regression model using  the historical weather data and visitor counts for the month
            const regression = new MultivariateLinearRegression(monthlyDataWeather[month], monthlyDataVisitors[month]);

            // Predict the visitor count for the day using average temperature and precipitation forecast for the day
            let result = regression.predict([averageWeatherData[i].avgTemperature, averageWeatherData[i].avgPrecipitation])[0];

            // Calculate the weighted average for weekends and check if the day is a weekend
            const weightedTotalWeekday = weekdayVisitorCounts[month] / weekdayCount[month];
            const weightedTotalWeekend = weekendVisitorCounts[month] / weekendCount[month];
            const weightendresult = weightedTotalWeekend / weightedTotalWeekday;
            if (dateObject.getDay() === 0 || dateObject.getDay() === 6) {
                result = result * weightendresult;
            }

            //add object with date, predicted visitor count, temperature and precipitation
            predictions[i] = {
                date: averageWeatherData[i].date,
                temperature: averageWeatherData[i].avgTemperature,
                precipitation: averageWeatherData[i].avgPrecipitation,
                predictedVisitors: result,
            }
        }
        //return array of prediction objects
        return predictions;
    }

    useEffect(() => {

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

        const predictionResults = PredictVisitorCounts();
        console.log('Prediction results:', predictionResults);
        setPredictionresults(predictionResults);
        //setPredictionresults(predictionResults);

    }, [weatherData]); // useEffect will run whenever weather forecast data changes

    return (
        <div className="p-6">
            <h1>Multiple Linear Regression</h1>
            <div className="flex justify-center">
                {predictionResults?.map((result, index) => (
                    <div className="p-4" key={index}>
                        <p>{new Date(result.date).toLocaleDateString('FI-fi')}</p>
                        <p>Lämpötila: {result.temperature.toFixed(1)} C</p>
                        <p>Sademäärä: {result.precipitation.toFixed(1)} mm</p>
                        <p>Ennuste: {result.predictedVisitors.toFixed(0)} Kävijää</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

