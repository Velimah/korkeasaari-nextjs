import { XMLParser } from "fast-xml-parser"; // Import the XMLParser from fast-xml-parser

const getEndTime = (): string => {
  const currentDate = new Date();
  const futureDate = new Date(currentDate.getTime() + 60 * 60 * 1000 * 240); // Adding 60 hours
  return futureDate.toISOString().split(".")[0] + "Z"; // Formatting to 'YYYY-MM-DDTHH:mm:ssZ'
};

// Define the interfaces for the data structures
interface MeasurementTVP {
  time: string;
  value: number;
}

export interface WeatherData {
  time: string;
  temperature: number;
  cloudCover: number;
  precipitation: number;
}

// Fetch and process the weather data
export const fetchFMIForecastData = async (): Promise<WeatherData[]> => {
  try {
    const endTime = getEndTime();
    const response = await fetch(
      `https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::edited::weather::scandinavia::point::timevaluepair&place=korkeasaari&endtime=${endTime}&`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();

    //console.log("ennuste", responseText);
    // Initialize the XML parser
    const parser = new XMLParser({
      ignoreAttributes: false, // Preserve attributes
      attributeNamePrefix: "", // Use attribute names directly
    });

    // Parse the XML string
    const xmlDoc = parser.parse(responseText);

    // Access the necessary data from the parsed XML
    const measurementTimeseriesElements =
      xmlDoc["wfs:FeatureCollection"]["wfs:member"];

    let temperatureData: MeasurementTVP[] = [];
    let precipitationAmountData: MeasurementTVP[] = [];
    let totalCloudCoverData: MeasurementTVP[] = [];

    measurementTimeseriesElements.forEach((member: any) => {
      const series =
        member["omso:PointTimeSeriesObservation"]["om:result"][
          "wml2:MeasurementTimeseries"
        ];

      // Identify the observed property to categorize the data
      const observedProperty =
        member["omso:PointTimeSeriesObservation"]["om:observedProperty"][
          "xlink:href"
        ];

      let currentSeriesData: MeasurementTVP[] = [];

      const points = series["wml2:point"];

      if (Array.isArray(points)) {
        points.forEach((point: any) => {
          const time = point["wml2:MeasurementTVP"]["wml2:time"];
          const value = parseFloat(point["wml2:MeasurementTVP"]["wml2:value"]);

          if (time && !isNaN(value)) {
            currentSeriesData.push({ time, value });
          }
        });
      }

      if (observedProperty.includes("Precipitation1h")) {
        precipitationAmountData = currentSeriesData;
      } else if (observedProperty.includes("Temperature")) {
        temperatureData = currentSeriesData;
      } else if (observedProperty.includes("TotalCloudCover")) {
        totalCloudCoverData = currentSeriesData;
      }
    });

    const combinedData = temperatureData.map((tempEntry) => {
      // Find the corresponding cloud cover entry
      const cloudCoverEntry = totalCloudCoverData.find(
        (cloudEntry) => cloudEntry.time === tempEntry.time,
      );

      const precipitationEntry = precipitationAmountData.find(
        (precipitationEntry) => precipitationEntry.time === tempEntry.time,
      );

      return {
        time: tempEntry.time,
        temperature: parseFloat(tempEntry.value.toFixed(1)),
        cloudCover: cloudCoverEntry
          ? parseFloat(cloudCoverEntry.value.toFixed(1))
          : 0,
        precipitation: precipitationEntry
          ? parseFloat(precipitationEntry.value.toFixed(1))
          : 0,
      };
    });
    //console.log("combinedData", combinedData);
    return combinedData;
  } catch (error) {
    console.error("Error fetching or processing data:", error);
    throw error;
  }
};
