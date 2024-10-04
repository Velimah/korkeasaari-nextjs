const filteredData = data.map((item) => {
    const year = item["Year"];
    const month = String(item["Month"]).padStart(2, '0'); // Ensure two digits for month
    const day = String(item["Day"]).padStart(2, '0'); // Ensure two digits for day
    const time = item["Time [Local time]"];

    // Construct the full ISO date (e.g., 2024-10-03T00:00:00)
    const fullDate = `${year}-${month}-${day}T${time}:00`;
    const hour = parseInt(time.split(":")[0], 10); // Extract the hour from the time

    return {
      date: new Date(fullDate).toISOString(),
      temperature: item["Air temperature mean [°C]"],
      cloudCover: item["Cloud cover [1/8]"],
      precipitation: item["Precipitation amount mean [mm]"],
      hour: hour // Save the hour to filter later
    };
  })
  .filter((item) => item.hour >= 10 && item.hour <= 20); // Filter by time between 10:00 and 20:00

// Function to calculate mean of a numeric array
const calculateMean = (array: number[]) => array.reduce((a, b) => a + b, 0) / array.length;

// Extract temperature, cloud cover, and precipitation for calculations
const temperatures = filteredData.map(item => item.temperature);
const cloudCovers = filteredData.map(item => parseFloat(item.cloudCover.split('(')[1].split('/')[0])); // Extract numeric cloud cover
const precipitations = filteredData.map(item => item.precipitation);

// Calculate means
const meanTemperature = calculateMean(temperatures);
const meanCloudCover = calculateMean(cloudCovers);
const meanPrecipitation = calculateMean(precipitations);