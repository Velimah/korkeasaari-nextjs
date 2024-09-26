/*
import FMI2019 from "@/assets/FMI2019.json";
import FMI2020 from "@/assets/FMI2020.json";
import FMI2021 from "@/assets/FMI2021.json";
import FMI2022 from "@/assets/FMI2022.json";
import FMI2023 from "@/assets/FMI2023.json";
import FMI2024 from "@/assets/FMI2024.json";

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
  const groupedRecords = FMI2024.reduce((acc: { [key: string]: WeatherData[] }, entry: WeatherData) => {
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

  console.log("FMI2019", aggregatedRecords);
  return aggregatedRecords;
};
  
*/

    /*
        useEffect(() => {
            const result = processWeatherData(EnkoraFMIData);
            setEnkoraFMIData(result);
            console.log('Processed data:', result);
        }, []); // Empty dependency array ensures this runs only once when the component mounts
    
        // Utility to check if a given date is a weekend
        const isWeekend = (dateString: string): boolean => {
            const date = new Date(dateString);
            const dayOfWeek = date.getDay();
            // 0: Sunday, 6: Saturday
            return dayOfWeek === 0 || dayOfWeek === 6;
        };
    
        // Function to process the data and apply the weight on weekends
        const processWeatherData = (data: any[]) => {
            return data.map((entry) => {
                const { date, total, totalPrecipitation } = entry;
                const numericTotal = Number(total); // Ensure total is a number
                let weightedTotal = isWeekend(date) ? 0.2 * numericTotal : numericTotal;
                if (totalPrecipitation > 0) {
                    weightedTotal = weightedTotal * 5;
                }
                return {
                    ...entry,
                    weightedTotal, // This will now always be a number
                };
            });
        };

        
    const first400Items = EnkoraFMIData.slice(0, 400);
    
    */