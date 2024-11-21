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

export default function processFMIWeatherData(
  data: WeatherData[],
): FormattedWeatherData {
  if (!data.length) {
    throw new Error("No data provided for processing.");
  }

  // Reduce data directly with time filtering
  const { temperatureSum, cloudcoverSum, precipitationSum, count } =
    data.reduce(
      (acc, entry) => {
        const date = new Date(entry.time);

        // Determine local Helsinki hour, accounting for DST
        const finnishHour = new Date(
          date.toLocaleString("en-US", { timeZone: "Europe/Helsinki" }),
        ).getHours();

        if (finnishHour >= 10 && finnishHour <= 20) {
          acc.temperatureSum += entry.temperature;
          acc.cloudcoverSum += entry.cloudcover;
          acc.precipitationSum += entry.precipitation;
          acc.count++;
        }
        return acc;
      },
      { temperatureSum: 0, cloudcoverSum: 0, precipitationSum: 0, count: 0 },
    );

  // Calculate means and total precipitation
  const meanTemperature = count ? temperatureSum / count : 0;
  const meanCloudcover = count ? cloudcoverSum / count : 0;

  return {
    date: data[0].time.split("T")[0],
    temperature: parseFloat(meanTemperature.toFixed(1)),
    cloudcover: parseFloat(meanCloudcover.toFixed(1)),
    precipitation: parseFloat(precipitationSum.toFixed(1)),
  };
}
