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

  // test arrays
  const allWeatherDataSummer: number[][] = [];
  const allWeatherDataWinter: number[][] = [];
  const allWeatherDataNovember: number[][] = [];
  const allWeatherDataDecember: number[][] = [];
  const allVisitorDataSummer: number[][] = [];
  const allVisitorDataWinter: number[][] = [];
  const allVisitorDataNovember: number[][] = [];
  const allVisitorDataDecember: number[][] = [];

  const allWeatherDataWinterHolidays: number[][] = [];
  const allVisitorDataWinterHolidays: number[][] = [];

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

        if (month === 4 || month === 5 || month === 6 || month === 7) {
          allWeatherDataSummer.push(weatherData);
          allVisitorDataSummer.push([visitorCount]);
        } else {
          allWeatherDataWinter.push(weatherData);
          allVisitorDataWinter.push([visitorCount]);
        }

        // test arrays
        if (month === 10) {
          allWeatherDataNovember.push(weatherData);
          allVisitorDataNovember.push([visitorCount]);
        }
        if (month === 11) {
          allWeatherDataDecember.push(weatherData);
          allVisitorDataDecember.push([visitorCount]);
        }

        // Categorize into weekday/weekend and update monthly averages
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          monthlyVisitorCounts[month].weekend.total += visitorCount;
          monthlyVisitorCounts[month].weekend.count += 1;
        } else {
          monthlyVisitorCounts[month].weekday.total += visitorCount;
          monthlyVisitorCounts[month].weekday.count += 1;
        }

        const currentDate = new Date(date); // Convert the input date to a Date object
        const year = currentDate.getFullYear();

        // Define holiday ranges
        const startOfHoliday1 = `${year}-12-25`;
        const endOfHoliday1 = `${year}-12-31`;
        const startOfHoliday2 = `${year}-01-01`;
        const endOfHoliday2 = `${year}-01-06`;

        // Check if the date falls within either range
        if (
          (date >= startOfHoliday1 && date <= endOfHoliday1) ||
          (date >= startOfHoliday2 && date <= endOfHoliday2)
        ) {
          allWeatherDataWinterHolidays.push(weatherData);
          allVisitorDataWinterHolidays.push([visitorCount]);
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

    /*
    // Train a single regression model
    const regression = new MultivariateLinearRegression(
      allWeatherData,
      allVisitorData,
    );

    console.log("Regression Weights:", regression.weights);
*/

    // test arrays
    const november = new MultivariateLinearRegression(
      allWeatherDataNovember,
      allVisitorDataNovember,
    );
    console.log("November Weights:", november.weights);
    const december = new MultivariateLinearRegression(
      allWeatherDataDecember,
      allVisitorDataDecember,
    );
    console.log("December Weights:", december.weights);

    for (const data of processedWeatherDataArray) {
      const dateObj = new Date(data.date);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth();
      const day = dateObj.getDay();

      // Train a regression model for summer and winter months

      const regression =
        month === 4 || month === 5 || month === 6 || month === 7
          ? new MultivariateLinearRegression(
              allWeatherDataSummer,
              allVisitorDataSummer,
            )
          : new MultivariateLinearRegression(
              allWeatherDataWinter,
              allVisitorDataWinter,
            );

      // Check if the date falls within winter holidays
      let predictedVisitorsWinterHolidays = 0;
      // Define holiday ranges
      const startOfHoliday1 = `${year}-12-25`;
      const endOfHoliday1 = `${year}-12-31`;
      const startOfHoliday2 = `${year}-01-01`;
      const endOfHoliday2 = `${year}-01-06`;
      if (
        (data.date >= startOfHoliday1 && data.date <= endOfHoliday1) ||
        (data.date >= startOfHoliday2 && data.date <= endOfHoliday2)
      ) {
        const winterHolidayRegression = new MultivariateLinearRegression(
          allWeatherDataWinterHolidays,
          allVisitorDataWinterHolidays,
        );
        predictedVisitorsWinterHolidays = winterHolidayRegression.predict([
          data.temperature,
          data.precipitation,
          data.cloudcover,
        ])[0];
      }

      //console.log("Regression Weights:", regression.weights);

      let predictedVisitors = regression.predict([
        data.temperature,
        data.precipitation,
        data.cloudcover,
      ])[0];
      // Debug: inspect raw prediction
      //console.log("Raw Prediction:", predictedVisitors);

      /*
      // Calculate the average visitors per day from all months
      const averageVisitors =
        allVisitorDataWinter.reduce(
          (acc, val) => acc + val[0], // Access the first element (visitor count) from each month
          0,
        ) / allVisitorDataWinter.length;
      // Calculate the month’s average visitor totals and multiplier
      const monthlyAverageVisitorTotals =
        (monthlyVisitorCounts[month].weekday.total +
          monthlyVisitorCounts[month].weekend.total) /
        (monthlyVisitorCounts[month].weekday.count +
          monthlyVisitorCounts[month].weekend.count);
      const monthMultiplier = monthlyAverageVisitorTotals / averageVisitors;
*/
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
