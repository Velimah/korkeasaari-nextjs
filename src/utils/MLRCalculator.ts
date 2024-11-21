import { BLOB } from "@/hooks/fetchBLobData";
import MultivariateLinearRegression from "ml-regression-multivariate-linear";
import processFMIWeatherData from "./FMIdataFormatter";
import { da } from "date-fns/locale";
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
  // arrays to store historical weather data and visitor counts for each month
  const monthlyDataWeather: number[][][] = Array.from({ length: 12 }, () => []);
  const monthlyDataVisitors: number[][][] = Array.from(
    { length: 12 },
    () => [],
  );

  // split the historical weather data and visitor counts into monthly arrays
  function getMonthlyHistoricalData(blobData: BLOB[]) {
    blobData.forEach(({ temperature, precipitation, cloudcover, date }) => {
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay(); // Get day of the week (0 for Sunday, 6 for Saturday)
      const month = dateObj.getMonth(); // Get month index (0 for January, 11 for December)
      // Push the values into the appropriate array for the month
      monthlyDataWeather[month].push([
        temperature ?? 0,
        precipitation ?? 0,
        cloudcover ?? 0,
        dayOfWeek,
      ]);
    });

    blobData.forEach(({ date, totalvisitors }) => {
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay(); // Get day of the week (0 for Sunday, 6 for Saturday)
      const month = dateObj.getMonth(); // Get month index (0 for January, 11 for December)

      // Push the visitor counts and day of week into the appropriate array for the month
      monthlyDataVisitors[month].push([
        totalvisitors ?? 0, // Default to 0 if null/undefined
        dayOfWeek, // Store the day of the week
      ]);
    });
  }

  // group the hourly weather data by date
  function getDailyWeatherData(weatherData: WeatherData[]) {
    const dailyWeatherData: { [date: string]: WeatherData[] } = {};
    weatherData.forEach(({ time, temperature, precipitation, cloudcover }) => {
      // Extract the date part from the time string
      const date = time.split("T")[0];
      // Initialize an array for the date if it doesn't exist
      if (!dailyWeatherData[date]) {
        dailyWeatherData[date] = [];
      }
      // Push the weather data for that time into the date's array
      dailyWeatherData[date].push({
        time,
        temperature: temperature ?? 0,
        precipitation: precipitation ?? 0,
        cloudcover: cloudcover ?? 0,
      });
    });
    // Convert the grouped data into an array of objects
    const formattedDailyWeatherData = Object.keys(dailyWeatherData).map(
      (date) => ({
        date,
        data: dailyWeatherData[date],
      }),
    );
    return formattedDailyWeatherData;
  }

  // predict visitor counts using the multivariate linear regression model
  function PredictVisitorCounts(dailyWeatherData: any) {
    // arrays to store the prediction results
    const processedWeatherDataArray: FormattedWeatherData[] = [];
    const predictions: Prediction[] = [];

    //process the grouped weather data to get averages for each day
    for (const day of dailyWeatherData) {
      const processedWeatherData = processFMIWeatherData(day.data);
      processedWeatherDataArray.push(processedWeatherData);
    }

    //loop through the average weather forecast data for each day and predict the visitor counts
    for (let i = 0; i < processedWeatherDataArray.length; i++) {
      // Get month index (0 for January, 11 for December)
      const dateObject = new Date(processedWeatherDataArray[i].date);
      const month = dateObject.getMonth() + 1;

      // Separate weekday and weekend data, remove day index
      const weekdayDataVisitors = monthlyDataVisitors[month]
        .filter((data) => data[1] !== 0 && data[1] !== 6)
        .map((data) => [data[0]]);
      const weekendDataVisitors = monthlyDataVisitors[month]
        .filter((data) => data[1] === 0 || data[1] === 6)
        .map((data) => [data[0]]);

      const weekdayDataWeather = monthlyDataWeather[month]
        .filter((data) => data[3] !== 0 && data[3] !== 6)
        .map((data) => [data[0], data[1], data[2]]);
      const weekendDataWeather = monthlyDataWeather[month]
        .filter((data) => data[3] === 0 || data[3] === 6)
        .map((data) => [data[0], data[1], data[2]]);

      // Train separate regression models for weekday and weekend data
      const weekdayRegression = new MultivariateLinearRegression(
        weekdayDataWeather,
        weekdayDataVisitors,
      );
      console.log("wr", weekdayRegression);

      const weekendRegression = new MultivariateLinearRegression(
        weekendDataWeather,
        weekendDataVisitors,
      );
      console.log("wer", weekendRegression);

      // Predict visitor counts using the corresponding regression model
      let result;
      if (dateObject.getDay() === 0 || dateObject.getDay() === 6) {
        result = weekendRegression.predict([
          processedWeatherDataArray[i].temperature,
          processedWeatherDataArray[i].precipitation,
          processedWeatherDataArray[i].cloudcover,
        ])[0];
      } else {
        result = weekdayRegression.predict([
          processedWeatherDataArray[i].temperature,
          processedWeatherDataArray[i].precipitation,
          processedWeatherDataArray[i].cloudcover,
        ])[0];
      }
      // Ensure the result is not negative
      if (result < 0) {
        result = 0;
      }

      //add object with date, predicted visitor count, temperature and precipitation

      predictions[i] = {
        date: processedWeatherDataArray[i].date,
        temperature: processedWeatherDataArray[i].temperature,
        precipitation: processedWeatherDataArray[i].precipitation,
        cloudcover: processedWeatherDataArray[i].cloudcover,
        predictedvisitors: Number(result.toFixed(0)),
      };
    }
    return predictions;
  }

  //populate the monthly data arrays with historical weather data and visitor counts
  getMonthlyHistoricalData(blobData);
  //group the weather forecast data by date
  const dailyWeatherData = getDailyWeatherData(weatherData);
  //predict the visitor counts with monthly historical data and daily weather forecast data
  const predictionResults = PredictVisitorCounts(dailyWeatherData);

  return predictionResults;
}
