interface WeatherData {
  time: string;
  temperature: number;
  cloudCover: number;
  precipitation: number;
}

interface FormattedWeatherData {
  date: string;
  temperature: number;
  cloudCover: number;
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
      acc.cloudCoverSum += entry.cloudCover;
      acc.precipitationSum += entry.precipitation;
      return acc;
    },
    { temperatureSum: 0, cloudCoverSum: 0, precipitationSum: 0 },
  );

  const count = filteredData.length;
  const meanTemperature = count ? summary.temperatureSum / count : 0;
  const meanCloudCover = count ? summary.cloudCoverSum / count : 0;
  const totalPrecipitation = summary.precipitationSum;

  // Return as a FormattedWeatherData object
  return {
    date: data[1].time.split("T")[0],
    temperature: parseFloat(meanTemperature.toFixed(1)),
    cloudCover: parseFloat(meanCloudCover.toFixed(1)),
    precipitation: parseFloat(totalPrecipitation.toFixed(1)),
  };
}
