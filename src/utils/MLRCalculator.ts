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

export default function MLRCalculator({
  weatherData,
  blobData,
}: {
  weatherData: WeatherData[];
  blobData: BLOB[];
}) {
  const monthlyDataWeather: number[][][] = Array.from({ length: 12 }, () => []); // Create 12 empty arrays for each month
  const monthlyDataVisitors: number[][][] = Array.from(
    { length: 12 },
    () => [],
  ); // Create 12 empty arrays for each month
  const weekdayVisitorCounts: number[] = Array.from({ length: 12 }, () => 0); // Track weekday visitors for each month
  const weekendVisitorCounts: number[] = Array.from({ length: 12 }, () => 0); // Track weekend visitors for each month
  const weekdayCount: number[] = Array.from({ length: 12 }, () => 0); // Count of weekdays for each month
  const weekendCount: number[] = Array.from({ length: 12 }, () => 0); // Count of weekends for each month

  function getMonthlyHistoricalData(blobData: BLOB[]) {
    // Create arrays to store the monthly data for weather
    blobData.forEach(({ temperature, precipitation, cloudcover, date }) => {
      // Create a Date object from the date string
      const month = new Date(date).getMonth(); // Get month index (0 for January, 11 for December)

      // Push the values into the appropriate array for the month
      monthlyDataWeather[month].push([
        temperature ?? 0,
        precipitation ?? 0,
        cloudcover ?? 0,
      ]);
    });

    // Create arrays to store the monthly data for visitors
    blobData.forEach(({ date, totalvisitors }) => {
      // Create a Date object from the date string
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay(); // Get day of the week (0 for Sunday, 6 for Saturday)
      const month = dateObj.getMonth(); // Get month index (0 for January, 11 for December)

      // calculate number of weekend and weekday visitors nad number of weekend dates and weekday dates
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // If it's Saturday (6) or Sunday (0)
        weekendVisitorCounts[month] += totalvisitors ?? 0; // Add to weekend visitor count
        weekendCount[month] += 1; // Increment weekend count
      } else {
        // If it's a weekday (Monday to Friday)
        weekdayVisitorCounts[month] += totalvisitors ?? 0; // Add to weekday visitor count
        weekdayCount[month] += 1; // Increment weekday count
      }

      // Push the visitor counts and day of week into the appropriate array for the month
      monthlyDataVisitors[month].push([
        totalvisitors ?? 0, // Default to 0 if null/undefined
        dayOfWeek, // Store the day of the week
      ]);
    });
  }

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

  // Function to predict visitor counts using the multivariate linear regression model
  function PredictVisitorCounts() {
    const predictions = []; // Define the predictions array

    getMonthlyHistoricalData(blobData);

    const groupedByDate = getDailyWeatherData(weatherData);

    const processedDataArray: FormattedWeatherData[] = []; // Define the processedDataArray
    for (const data of groupedByDate) {
      const processedData = processFMIWeatherData(data.data);
      processedDataArray.push(processedData);
    }

    //loop through the average weather forecast data for each day and predict the visitor counts
    for (let i = 0; i < processedDataArray.length; i++) {
      const dateObject = new Date(processedDataArray[i].date);
      const month = dateObject.getMonth() + 1; // Get month index (0 for January, 11 for December)

      // Calculate the weight multiplier for weekends
      const weightedTotalWeekday =
        weekdayVisitorCounts[month] / weekdayCount[month];
      const weightedTotalWeekend =
        weekendVisitorCounts[month] / weekendCount[month];
      const weightendresult = weightedTotalWeekend / weightedTotalWeekday;

      // flatten the weekend visitors to the weekday visitors ???
      const formattedMonthlyDataVisitors = monthlyDataVisitors[month].map(
        (data) => {
          if (data[1] === 0 || data[1] === 6) {
            return [data[0]]; // Keep only the first item
          }
          const removeWeekendweight = data[0] / weightendresult;
          return [data[0]]; // retun the visitor count or the visitor count divided by the weekend weight???
        },
      );

      // Create a regression model using  the historical weather data and visitor counts for the month
      const regression = new MultivariateLinearRegression(
        monthlyDataWeather[month],
        formattedMonthlyDataVisitors,
      );

      // Predict the visitor count for the day using average temperature and precipitation forecast for the day
      let result = regression.predict([
        processedDataArray[i].temperature,
        processedDataArray[i].precipitation,
        processedDataArray[i].cloudcover,
      ])[0];

      // Check if the day is a weekend and adjust the prediction accordingly
      if (dateObject.getDay() === 0 || dateObject.getDay() === 6) {
        result = result * weightendresult;
      }

      // Ensure the result is not negative
      if (result < 0) {
        result = 0;
      }

      //add object with date, predicted visitor count, temperature and precipitation

      predictions[i] = {
        date: processedDataArray[i].date,
        temperature: processedDataArray[i].temperature,
        precipitation: processedDataArray[i].precipitation,
        cloudcover: processedDataArray[i].cloudcover,
        predictedvisitors: Number(result.toFixed(0)),
      };
    }
    //return array of prediction objects
    return predictions;
  }
  const predictionResults = PredictVisitorCounts();

  return predictionResults;
}
