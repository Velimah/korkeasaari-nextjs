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

export default function MLRCalculator2({
  weatherData,
  blobData,
}: {
  weatherData: WeatherData[];
  blobData: BLOB[];
}) {
  // Arrays to store historical weather data and visitor counts for summer and non-summer
  const summerDataWeather: number[][] = [];
  const summerDataVisitors: number[][] = [];
  const nonSummerDataWeather: number[][] = [];
  const nonSummerDataVisitors: number[][] = [];
  const processedWeatherDataArray: FormattedWeatherData[] = [];

  // Determine if a month is a summer month
  const isSummerMonth = (month: number) => [5, 6, 7].includes(month); // 0-based indexing for months

  // Split the historical weather data and visitor counts into summer and non-summer arrays
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
          dayOfWeek,
        ];
        const visitorData = [totalvisitors ?? 0, dayOfWeek];

        if (isSummerMonth(month)) {
          summerDataWeather.push(weatherData);
          summerDataVisitors.push(visitorData);
        } else {
          nonSummerDataWeather.push(weatherData);
          nonSummerDataVisitors.push(visitorData);
        }
      },
    );
  }

  // Group the hourly weather data by date and process it to get averages for each day
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

  // Predict visitor counts using the multivariate linear regression model
  function PredictVisitorCounts(
    processedWeatherDataArray: FormattedWeatherData[],
  ) {
    const predictions: Prediction[] = [];

    // Train separate regression models for summer and non-summer data
    const weekdaySummerDataVisitors = summerDataVisitors
      .filter((data) => data[1] !== 0 && data[1] !== 6)
      .map((data) => [data[0]]);
    const weekendSummerDataVisitors = summerDataVisitors
      .filter((data) => data[1] === 0 || data[1] === 6)
      .map((data) => [data[0]]);

    const weekdaySummerDataWeather = summerDataWeather
      .filter((data) => data[3] !== 0 && data[3] !== 6)
      .map((data) => [data[0], data[1], data[2]]);
    const weekendSummerDataWeather = summerDataWeather
      .filter((data) => data[3] === 0 || data[3] === 6)
      .map((data) => [data[0], data[1], data[2]]);

    const weekdayNonSummerDataVisitors = nonSummerDataVisitors
      .filter((data) => data[1] !== 0 && data[1] !== 6)
      .map((data) => [data[0]]);
    const weekendNonSummerDataVisitors = nonSummerDataVisitors
      .filter((data) => data[1] === 0 || data[1] === 6)
      .map((data) => [data[0]]);

    const weekdayNonSummerDataWeather = nonSummerDataWeather
      .filter((data) => data[3] !== 0 && data[3] !== 6)
      .map((data) => [data[0], data[1], data[2]]);
    const weekendNonSummerDataWeather = nonSummerDataWeather
      .filter((data) => data[3] === 0 || data[3] === 6)
      .map((data) => [data[0], data[1], data[2]]);

    const weekdaySummerRegression = new MultivariateLinearRegression(
      weekdaySummerDataWeather,
      weekdaySummerDataVisitors,
    );
    const weekendSummerRegression = new MultivariateLinearRegression(
      weekendSummerDataWeather,
      weekendSummerDataVisitors,
    );
    const weekdayNonSummerRegression = new MultivariateLinearRegression(
      weekdayNonSummerDataWeather,
      weekdayNonSummerDataVisitors,
    );
    const weekendNonSummerRegression = new MultivariateLinearRegression(
      weekendNonSummerDataWeather,
      weekendNonSummerDataVisitors,
    );
    console.log(
      "weekdaySummerRegression",
      weekdaySummerRegression,
      "weekendSummerRegression",
      weekendSummerRegression,
      "weekdayNonSummerRegression",
      weekdayNonSummerRegression,
      "weekendNonSummerRegression",
      weekendNonSummerRegression,
    );

    // Predict visitor counts
    for (const data of processedWeatherDataArray) {
      const dateObject = new Date(data.date);
      const day = dateObject.getDay();
      const month = dateObject.getMonth();

      let regressionModel;
      if (isSummerMonth(month)) {
        regressionModel =
          day === 0 || day === 6
            ? weekendSummerRegression
            : weekdaySummerRegression;
      } else {
        regressionModel =
          day === 0 || day === 6
            ? weekendNonSummerRegression
            : weekdayNonSummerRegression;
      }

      let result = regressionModel.predict([
        data.temperature,
        data.precipitation,
        data.cloudcover,
      ])[0];

      if (result < 0) result = 0;

      predictions.push({
        date: data.date,
        temperature: data.temperature,
        precipitation: data.precipitation,
        cloudcover: data.cloudcover,
        predictedvisitors: Math.round(result),
      });
    }

    console.log(predictions);
    return predictions;
  }

  getHistoricalData(blobData);
  getWeatherForecast(weatherData);
  return PredictVisitorCounts(processedWeatherDataArray);
}
