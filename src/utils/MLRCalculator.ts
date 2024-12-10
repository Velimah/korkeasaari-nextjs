import { BLOB } from "@/hooks/fetchBLobData";
import MultivariateLinearRegression from "ml-regression-multivariate-linear";
import processFMIWeatherData from "./FMIdataFormatter";
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

export default function MLRCalculator({
  weatherData,
  blobData,
}: {
  weatherData: WeatherData[];
  blobData: BLOB[];
}) {
  const allWeatherDataWinterHolidays: number[][] = [];
  const allVisitorDataWinterHolidays: number[][] = [];

  const processedWeatherDataArray: FormattedWeatherData[] = [];

  const monthlyWeatherData: number[][][] = Array.from({ length: 12 }, () => []);
  const monthlyVisitorData: number[][][] = Array.from({ length: 12 }, () => []);

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
        const year = dateObj.getFullYear();

        const weatherData = [
          temperature ?? 0,
          precipitation ?? 0,
          cloudcover ?? 0,
        ];
        const visitorCount = totalvisitors ?? 0;

        // Categorize into weekday/weekend and update monthly averages
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          monthlyVisitorCounts[month].weekend.total += visitorCount;
          monthlyVisitorCounts[month].weekend.count += 1;
        } else {
          monthlyVisitorCounts[month].weekday.total += visitorCount;
          monthlyVisitorCounts[month].weekday.count += 1;
        }

        // Define holiday ranges
        const startOfWinterHoliday1 = `${year}-12-25`;
        const endOfWinterHoliday1 = `${year}-12-31`;
        const startOfWinterHoliday2 = `${year}-01-01`;
        const endOfWinterHoliday2 = `${year}-01-06`;

        // Check if the date falls within either range
        if (
          (date >= startOfWinterHoliday1 && date <= endOfWinterHoliday1) ||
          (date >= startOfWinterHoliday2 && date <= endOfWinterHoliday2)
        ) {
          allWeatherDataWinterHolidays.push(weatherData);
          allVisitorDataWinterHolidays.push([visitorCount]);
        } else {
          monthlyWeatherData[month].push(weatherData);
          monthlyVisitorData[month].push([visitorCount]);
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

    for (const data of processedWeatherDataArray) {
      const dateObj = new Date(data.date);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth();
      const day = dateObj.getDay();

      // Check if the date falls within winter holidays
      let predictedVisitors = 0;
      // Define holiday ranges
      const startOfWinterHoliday1 = `${year}-12-25`;
      const endOfWinterHoliday1 = `${year}-12-31`;
      const startOfWinterHoliday2 = `${year}-01-01`;
      const endOfWinterHoliday2 = `${year}-01-06`;

      if (
        (data.date >= startOfWinterHoliday1 &&
          data.date <= endOfWinterHoliday1) ||
        (data.date >= startOfWinterHoliday2 && data.date <= endOfWinterHoliday2)
      ) {
        const winterHolidayRegression = new MultivariateLinearRegression(
          allWeatherDataWinterHolidays,
          allVisitorDataWinterHolidays,
        );
        predictedVisitors = winterHolidayRegression.predict([
          data.temperature,
          data.precipitation,
          data.cloudcover,
        ])[0];
      } else {
        const monthlyRegression = new MultivariateLinearRegression(
          monthlyWeatherData[month],
          monthlyVisitorData[month],
        );
        predictedVisitors = monthlyRegression.predict([
          data.temperature,
          data.precipitation,
          data.cloudcover,
        ])[0];
      }

      // Calculate the weekend/weekday visitor ratio based on the month’s data
      const weekendVisitorRatio =
        monthlyAverageVisitors[month].weekend /
        monthlyAverageVisitors[month].weekday;

      // Calculate the weekday and weekend multipliers with some unknown magical logic
      const totalVisitorsForWeek = predictedVisitors * 7;
      const totalWeekdays = 5; // Number of weekdays (5 days)
      const totalWeekends = 2; // Number of weekend days (2 days)

      const weekdayMultiplier =
        totalVisitorsForWeek /
        (totalWeekdays * predictedVisitors +
          totalWeekends * weekendVisitorRatio * predictedVisitors);

      const weekendMultiplier = weekendVisitorRatio * weekdayMultiplier;

      // Add the weight multipliers to the prediction
      const isWeekend = day === 0 || day === 6; // Check if it's a weekend (0 = Sunday, 6 = Saturday)
      isWeekend
        ? (predictedVisitors = predictedVisitors * weekendMultiplier)
        : (predictedVisitors = predictedVisitors * weekdayMultiplier);

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
    return predictions;
  }

  // Populate historical data and calculate averages
  getHistoricalData(blobData);
  // Process the weather forecast data
  getWeatherForecast(weatherData);
  // Predict visitor counts
  return PredictVisitorCounts(processedWeatherDataArray);
}
