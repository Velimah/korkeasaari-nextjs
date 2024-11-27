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
  // arrays to store historical weather data and visitor counts for each month
  const monthlyDataWeather: number[][][] = Array.from({ length: 12 }, () => []);
  const monthlyDataVisitors: number[][][] = Array.from(
    { length: 12 },
    () => [],
  );
  const processedWeatherDataArray: FormattedWeatherData[] = [];

  // split the historical weather data and visitor counts into monthly arrays
  function getHistoricalData(blobData: BLOB[]) {
    blobData.forEach(
      ({ temperature, precipitation, cloudcover, date, totalvisitors }) => {
        const dateObj = new Date(date);
        const dayOfWeek = dateObj.getDay();
        const month = dateObj.getMonth();

        // Add weather data
        monthlyDataWeather[month].push([
          temperature ?? 0,
          precipitation ?? 0,
          cloudcover ?? 0,
          dayOfWeek,
        ]);

        // Add visitor data
        monthlyDataVisitors[month].push([totalvisitors ?? 0, dayOfWeek]);
      },
    );
  }

  // group the hourly weather data by date and process it to get averages for each day
  function getWeatherForecast(weatherData: WeatherData[]) {
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

    //process the weather forecast data to get averages for each day
    for (const day of formattedDailyWeatherData) {
      const processedWeatherData = processFMIWeatherData(day.data);
      processedWeatherDataArray.push(processedWeatherData);
    }
  }

  // predict visitor counts using the multivariate linear regression model
  function PredictVisitorCounts(
    processedWeatherDataArray: FormattedWeatherData[],
  ) {
    // arrays to store the prediction results
    const predictions: Prediction[] = [];

    //loop through the average weather forecast data for each day and predict the visitor counts
    for (let i = 0; i < processedWeatherDataArray.length; i++) {
      // Get month index (0 for January, 11 for December)
      const dateObject = new Date(processedWeatherDataArray[i].date);
      const month = dateObject.getMonth();

      // Check for valid data
      if (
        !monthlyDataWeather[month]?.length ||
        !monthlyDataVisitors[month]?.length
      ) {
        console.warn(`No historical data for month: ${month}`);
        continue;
      }

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

      const weekendRegression = new MultivariateLinearRegression(
        weekendDataWeather,
        weekendDataVisitors,
      );
      console.log("weekday", weekdayRegression, "weekend", weekendRegression);

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
    console.log(predictions);
    return predictions;
  }
  //populate the monthly data arrays with historical weather data and visitor counts
  getHistoricalData(blobData);
  //group the weather forecast data by date
  getWeatherForecast(weatherData);
  //predict the visitor counts with historical and weather forecast data
  return PredictVisitorCounts(processedWeatherDataArray);
}
