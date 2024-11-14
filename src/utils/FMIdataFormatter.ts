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

// Function to filter data and calculate mean values
export default function processFMIWeatherData(
  data: WeatherData[],
): FormattedWeatherData {
  // Filter entries between 10:00 and 20:00 local finnish time
  const filteredData = data.filter((entry) => {
    const date = new Date(entry.time);
    const finnishHour = new Date(
      date.toLocaleString("en-US", { timeZone: "Europe/Helsinki" }),
    ).getHours();
    return finnishHour >= 10 && finnishHour <= 20;
  });

  // Calculate mean temperature, mean cloud cover, and total precipitation
  const summary = filteredData.reduce(
    (acc, entry) => {
      acc.temperatureSum += entry.temperature;
      acc.cloudcoverSum += entry.cloudcover;
      acc.precipitationSum += entry.precipitation;
      return acc;
    },
    { temperatureSum: 0, cloudcoverSum: 0, precipitationSum: 0 },
  );

  const count = filteredData.length;
  const meanTemperature = count ? summary.temperatureSum / count : 0;
  const meancloudcover = count ? summary.cloudcoverSum / count : 0;
  const totalPrecipitation = summary.precipitationSum;

  // Return as a FormattedWeatherData object
  return {
    date: data[0].time.split("T")[0],
    temperature: parseFloat(meanTemperature.toFixed(1)),
    cloudcover: parseFloat(meancloudcover.toFixed(1)),
    precipitation: parseFloat(totalPrecipitation.toFixed(1)),
  };
}
