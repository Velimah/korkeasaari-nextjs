import EnkoraFMIData from "@/assets/FormattedEnkoraFMI.json";
import MultivariateLinearRegression from 'ml-regression-multivariate-linear';
import { useEffect, useState } from "react";

export default function LinearRegression() {
    const [predictedVisitors, setPredictedVisitors] = useState<number>();

    useEffect(() => {

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
        const result = regression.predict([5, 10]);
        const result2 = result[0] * weightendresult;
        console.log('Prediction weekday:', result[0]);
        console.log('Prediction weekend:', result2);


    }, []); // Empty dependency array ensures this runs only once after the initial render



    return (
        <div>
            <h1>Multiple Linear Regression</h1>
            <p>Input Temperature: 18</p>
            <p>Input Rainfall: 40</p>
            <p>Input Weekend: 1</p>
            <p>Input Summer Holiday: 1</p>
            <p>Prediction: {predictedVisitors} Visitors</p>
        </div>
    );
}

