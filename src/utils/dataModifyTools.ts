 /*
// Combine data based on matching dates
const combinedData = FMIdata.map(weather => {
  const ticket = EnkoraVisitorData.find(t => t.day === weather.date);
  const { day, ...ticketWithoutDay } = ticket || {};
  return {
    ...weather,
    ...ticketWithoutDay // Merges ticket data excluding the 'day' property
  };
});

console.log(combinedData);

  const combined = EnkoraVisitorData.reduce((acc: { [day: string]: { [key: number]: number } }, { day, service_group_id, quantity }) => {
    // If the day doesn't exist in the accumulator, initialize it
    if (!acc[day]) {
      acc[day] = {};
    }
 
    // Add the service group and quantity for the current day
    acc[day][service_group_id] = quantity;
 
    return acc;
  }, {});
 
  const idMap: { [key: string]: string } = {
    "2": "kulkulupa",
    "3": "ilmaiskavijat",
    "5": "paasyliput",
    "7": "kampanjakavijat",
    "18": "verkkokauppa_paasyliput",
    "19": "vuosiliput"
  };
 
  const transformedData = Object.entries(combined).map(([day, serviceGroups]) => {
    // Map service groups with idMap and include the day in the object
    const transformedServiceGroups = Object.entries(serviceGroups).reduce((acc: { [key: string]: number }, [groupId, quantity]) => {
      const mappedKey = idMap[groupId] || groupId; // Use mapped key if exists, else use original key
      acc[mappedKey] = quantity;
      return acc;
    }, {});
 
    // Return the object with the day included
    return { day, ...transformedServiceGroups };
  });
 
  // Use useEffect to log to the browser console
  useEffect(() => {
    console.log(transformedData);
  }, [transformedData]);

// Function to reformat the date from "1.1.2019" to "2019-01-01"
function reformatDate(dateStr: string): string {
  const [day, month, year] = dateStr.split('.').map(Number);
  // Format the day and month to always have two digits
  const formattedDay = String(day).padStart(2, '0');
  const formattedMonth = String(month).padStart(2, '0');
  return `${year}-${formattedMonth}-${formattedDay}`;
}

// Transform the data, updating the date format
const transformedData = EnkoraVisitorData.map(entry => ({
  ...entry,
  day: reformatDate(entry.day)
}));

useEffect(() => {
  console.log(transformedData);
}, [transformedData]);

// Function to transform data and calculate total count excluding "kulkulupa"
const transformedData = EnkoraVisitorData.map(entry => {
  // Calculate the total count excluding "kulkulupa"
  const total = Object.entries(entry).reduce((acc, [key, value]) => {
    if (key !== "day" && key !== "kulkulupa") {
      acc += value; // Sum the values of the other keys
    }
    return acc;
  }, 0);

  // Return the new object including the total count
  return {
    ...entry,
    total // Add total to the object
  };
});

useEffect(() => {
  console.log(transformedData);
}, [transformedData]);

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