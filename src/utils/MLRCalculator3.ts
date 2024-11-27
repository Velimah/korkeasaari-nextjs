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

export default function MLRCalculator3({
  weatherData,
  blobData,
}: {
  weatherData: WeatherData[];
  blobData: BLOB[];
}) {
  // Arrays for weekday and weekend data
  const weekdayWeatherData: number[][] = [];
  const weekdayVisitorData: number[][] = [];
  const weekendWeatherData: number[][] = [];
  const weekendVisitorData: number[][] = [];
  const processedWeatherDataArray: FormattedWeatherData[] = [];

  // Store monthly averages for weekday and weekend visitors
  const monthlyAverageVisitors = Array.from({ length: 12 }, () => ({
    weekday: 0,
    weekend: 0,
  }));

  // Separate historical data by weekday and weekend
  function getHistoricalData(blobData: BLOB[]) {
    const monthlyVisitorCounts = Array.from({ length: 12 }, () => ({
      weekday: { total: 0, count: 0 },
      weekend: { total: 0, count: 0 },
    }));

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

        if (dayOfWeek === 0 || dayOfWeek === 6) {
          weekendWeatherData.push(weatherData);
          weekendVisitorData.push([visitorCount]);

          // Update monthly weekend stats
          monthlyVisitorCounts[month].weekend.total += visitorCount;
          monthlyVisitorCounts[month].weekend.count += 1;
        } else {
          weekdayWeatherData.push(weatherData);
          weekdayVisitorData.push([visitorCount]);

          // Update monthly weekday stats
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

  // Group the weather data by date and process it into averages
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

  // Predict visitor counts using regression and weighting
  function PredictVisitorCounts(
    processedWeatherDataArray: FormattedWeatherData[],
  ) {
    const predictions: Prediction[] = [];

    // Train regression models
    const weekdayRegression = new MultivariateLinearRegression(
      weekdayWeatherData,
      weekdayVisitorData,
    );
    const weekendRegression = new MultivariateLinearRegression(
      weekendWeatherData,
      weekendVisitorData,
    );
    console.log(
      "weekdayRegression",
      weekdayRegression,
      "weekendRegression",
      weekendRegression,
    );

    for (const data of processedWeatherDataArray) {
      const dateObj = new Date(data.date);
      const month = dateObj.getMonth();
      const day = dateObj.getDay();

      let predictedVisitors;
      if (day === 0 || day === 6) {
        // Weekend prediction
        predictedVisitors = weekendRegression.predict([
          data.temperature,
          data.precipitation,
          data.cloudcover,
        ])[0];
        // Weight by monthly weekend average
        predictedVisitors *=
          monthlyAverageVisitors[month].weekend /
          (monthlyAverageVisitors[month].weekday +
            monthlyAverageVisitors[month].weekend || 1);
      } else {
        // Weekday prediction
        predictedVisitors = weekdayRegression.predict([
          data.temperature,
          data.precipitation,
          data.cloudcover,
        ])[0];
        // Weight by monthly weekday average
        predictedVisitors *=
          monthlyAverageVisitors[month].weekday /
          (monthlyAverageVisitors[month].weekday +
            monthlyAverageVisitors[month].weekend || 1);
      }

      // Ensure no negative predictions
      if (predictedVisitors < 0) predictedVisitors = 0;

      predictions.push({
        date: data.date,
        temperature: data.temperature,
        precipitation: data.precipitation,
        cloudcover: data.cloudcover,
        predictedvisitors: Math.round(predictedVisitors),
      });
    }

    console.log(predictions);
    return predictions;
  }

  // Populate the historical data and calculate averages
  getHistoricalData(blobData);
  // Process the weather forecast data
  getWeatherForecast(weatherData);
  // Predict the visitor counts
  return PredictVisitorCounts(processedWeatherDataArray);
}
