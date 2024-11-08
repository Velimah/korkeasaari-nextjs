interface WeatherData {
  time: string;
  temperature: number;
  cloudCover: number;
  precipitation: number;
}

// Function to filter data and calculate mean values
export function processWeatherObservationData(
  data: WeatherData[],
): WeatherData {
  // Filter entries between 10:00 and 20:00
  const filteredData = data.filter((entry) => {
    const hour = new Date(entry.time).getUTCHours();
    return hour >= 10 && hour <= 20;
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

  // Return as a WeatherData object
  return {
    time: data[1].time.split("T")[0], // Placeholder time, as this is a summary
    temperature: parseFloat(meanTemperature.toFixed(1)),
    cloudCover: parseFloat(meanCloudCover.toFixed(1)),
    precipitation: parseFloat(totalPrecipitation.toFixed(1)),
  };
}
