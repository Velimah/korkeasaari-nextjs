import FMI2023 from "../assets/FMI2023.json";

interface WeatherData {
    station: string;
    year: number;
    month: number; // Assumed to be 1-based (1 for January, 2 for February, etc.)
    date: number;  // Assumed to be a valid day of the month
    time: string;  // Time in "HH:MM" format
    temperature: number;
    precipitation: number | string;
  }
  
export interface AggregatedWeatherRecord {
  date: string; // ISO 8601 formatted timestamp
  averageTemperature: number;
  totalPrecipitation: number | string;
}

export const fetchWeatherHistoricalData = (): AggregatedWeatherRecord[] => {

  // Helper function to check if time is within the range 10:00 to 20:00
  const isTimeInRange = (time: string): boolean => {
      const [hours] = time.split(':').map(Number);
      return hours >= 10 && hours <= 20;
  };

  // Group records by date
  const groupedRecords = FMI2023.reduce((acc: { [key: string]: WeatherData[] }, entry: WeatherData) => {
    if (isTimeInRange(entry.time)) {
      const { year, month, date } = entry;
      const dateKey = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(entry);
    }
    return acc;
  }, {});

  // Calculate average temperature and total precipitation for each date
  const aggregatedRecords: AggregatedWeatherRecord[] = Object.keys(groupedRecords).map(dateKey => {
    const records = groupedRecords[dateKey];
    const totalTemperature = records.reduce((sum, record) => sum + record.temperature, 0);
    const averageTemperature = totalTemperature / records.length;

    const totalPrecipitation = records.reduce((sum, record) => {
      return typeof sum === 'number' && typeof record.precipitation === 'number'
        ? sum + record.precipitation
        : sum; // Simplified: assumes no mixed types in real data
    }, 0);

    return {
      date: `${dateKey}`,
      averageTemperature: parseFloat(averageTemperature.toFixed(2)),
      totalPrecipitation: parseFloat(totalPrecipitation.toFixed(2)),
    };
  });

  return aggregatedRecords;
};
  
  