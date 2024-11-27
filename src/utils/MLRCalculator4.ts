import { BLOB } from "@/hooks/fetchBLobData";
import MultivariateLinearRegression from "ml-regression-multivariate-linear";
import processFMIWeatherData from "./FMIdataFormatter";
import { is } from "date-fns/locale";
interface WeatherData {
  time: string;
  temperature: number;
  cloudcover: number;
  precipitation: number;
}

interface FormattedWeatherData {
  date: string;
  temperature: number;
  cloudcover: number;
  precipitation: number;
}

interface Prediction {
  date: string;
  temperature: number;
  precipitation: number;
  cloudcover: number;
  predictedvisitors: number;
}

export default function MLRCalculator4({
  weatherData,
  blobData,
}: {
  weatherData: WeatherData[];
  blobData: BLOB[];
}) {
  const allWeatherData: number[][] = [];
  const allVisitorData: number[][] = [];
  const processedWeatherDataArray: FormattedWeatherData[] = [];
  const monthlyVisitorCounts = Array.from({ length: 12 }, () => ({
    weekday: { total: 0, count: 0 },
    weekend: { total: 0, count: 0 },
  }));

  // Store monthly averages for visitor counts by weekday/weekend
  const monthlyAverageVisitors = Array.from({ length: 12 }, () => ({
    weekday: 0,
    weekend: 0,
  }));

  // Gather historical data and calculate monthly averages
  function getHistoricalData(blobData: BLOB[]) {
    blobData.forEach(
      ({ temperature, precipitation, cloudcover, date, totalvisitors }) => {
        const dateObj = new Date(date);
        const dayOfWeek = dateObj.getDay();
        const month = dateObj.getMonth();

        const weatherData = [
          temperature ?? 0,
          precipitation ?? 0,
          cloudcover ?? 0,
        ];
        const visitorCount = totalvisitors ?? 0;

        // Add to all data arrays
        allWeatherData.push(weatherData);
        allVisitorData.push([visitorCount]);

        // Categorize into weekday/weekend and update monthly averages
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          monthlyVisitorCounts[month].weekend.total += visitorCount;
          monthlyVisitorCounts[month].weekend.count += 1;
        } else {
          monthlyVisitorCounts[month].weekday.total += visitorCount;
          monthlyVisitorCounts[month].weekday.count += 1;
        }
      },
    );

    // Calculate monthly averages for weekday and weekend visitors
    monthlyVisitorCounts.forEach((data, month) => {
      monthlyAverageVisitors[month].weekday =
        data.weekday.count > 0 ? data.weekday.total / data.weekday.count : 0;
      monthlyAverageVisitors[month].weekend =
        data.weekend.count > 0 ? data.weekend.total / data.weekend.count : 0;
    });
  }

  // Process weather forecast data
  function getWeatherForecast(weatherData: WeatherData[]) {
    const dailyWeatherData: { [date: string]: WeatherData[] } = {};
    weatherData.forEach(({ time, temperature, precipitation, cloudcover }) => {
      const date = time.split("T")[0];
      if (!dailyWeatherData[date]) {
        dailyWeatherData[date] = [];
      }
      dailyWeatherData[date].push({
        time,
        temperature: temperature ?? 0,
        precipitation: precipitation ?? 0,
        cloudcover: cloudcover ?? 0,
      });
    });

    for (const day of Object.keys(dailyWeatherData)) {
      const processedWeatherData = processFMIWeatherData(dailyWeatherData[day]);
      processedWeatherDataArray.push(processedWeatherData);
    }
  }

  // Predict visitor counts with weights
  function PredictVisitorCounts(
    processedWeatherDataArray: FormattedWeatherData[],
  ) {
    const predictions: Prediction[] = [];

    // Train a single regression model
    const regression = new MultivariateLinearRegression(
      allWeatherData,
      allVisitorData,
    );
    console.log("Regression Weights:", regression.weights);

    for (const data of processedWeatherDataArray) {
      const dateObj = new Date(data.date);
      const month = dateObj.getMonth();
      const day = dateObj.getDay();

      let predictedVisitors = regression.predict([
        data.temperature,
        data.precipitation,
        data.cloudcover,
      ])[0];
      // Debug: inspect raw prediction
      console.log("Raw Prediction:", predictedVisitors);

      // Weight adjustment logic

      // Calculate the average visitors from all months
      const averageVisitors =
        allVisitorData.reduce(
          (acc, val) => acc + val[0], // Access the first element (visitor count) from each month
          0,
        ) / allVisitorData.length;

      const monthlyAverageVisitorTotals =
        (monthlyVisitorCounts[month].weekday.total +
          monthlyVisitorCounts[month].weekend.total) /
        (monthlyVisitorCounts[month].weekday.count +
          monthlyVisitorCounts[month].weekend.count);

      const monthMultiplier = monthlyAverageVisitorTotals / averageVisitors;

      // Calculate the weekend multiplier based on the month’s data
      const weekendVisitorRatio =
        monthlyAverageVisitors[month].weekend /
        monthlyAverageVisitors[month].weekday;

      // Calculate total visitors for the entire week (7 days)
      const totalVisitorsForWeek = predictedVisitors * 7;
      const totalWeekdays = 5; // Number of weekdays (5 days)
      const totalWeekends = 2; // Number of weekend days (2 days)

      // Calculate the scaling factor
      const weekdayMultiplier =
        totalVisitorsForWeek /
        (totalWeekdays * predictedVisitors +
          totalWeekends * weekendVisitorRatio * predictedVisitors);

      // Calculate the weekday and weekend multipliers
      const weekendMultiplier = weekendVisitorRatio * weekdayMultiplier;

      // Calculate predicted visitors for weekdays and weekends
      const weekdayVisitors =
        predictedVisitors * monthMultiplier * weekdayMultiplier;
      const weekendVisitors =
        predictedVisitors * monthMultiplier * weekendMultiplier;

      const isWeekend = day === 0 || day === 6; // Check if it's a weekend (0 = Sunday, 6 = Saturday)

      isWeekend
        ? (predictedVisitors = weekendVisitors)
        : (predictedVisitors = weekdayVisitors);

      // Ensure no negative predictions
      predictedVisitors = Math.max(predictedVisitors, 0);

      predictions.push({
        date: data.date,
        temperature: data.temperature,
        precipitation: data.precipitation,
        cloudcover: data.cloudcover,
        predictedvisitors: Math.round(predictedVisitors),
      });
    }

    console.log("weightedPredictions:", predictions);
    return predictions;
  }

  // Populate historical data and calculate averages
  getHistoricalData(blobData);
  // Process the weather forecast data
  getWeatherForecast(weatherData);
  // Predict visitor counts
  return PredictVisitorCounts(processedWeatherDataArray);
}
