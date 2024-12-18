import { XMLParser } from "fast-xml-parser"; // Import the XMLParser from fast-xml-parser

// Define the interfaces for the data structures
interface MeasurementTVP {
  time: string;
  value: number;
}

export interface WeatherData {
  time: string;
  temperature: number;
  cloudcover: number;
  precipitation: number;
}

// Fetch and process the weather data
export const fetchFMIObservationData = async (
  startDate: string,
  endDate: string,
): Promise<WeatherData[]> => {
  try {
    const response = await fetch(
      `https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::timevaluepair&place=korkeasaari&timestep=60&parameters=t2m,r_1h,n_man&starttime=${startDate}&endtime=${endDate}&`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseText = await response.text();

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
    let totalcloudcoverData: MeasurementTVP[] = [];

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

      if (observedProperty.includes("r_1h")) {
        precipitationAmountData = currentSeriesData;
      } else if (observedProperty.includes("t2m")) {
        temperatureData = currentSeriesData;
      } else if (observedProperty.includes("n_man")) {
        totalcloudcoverData = currentSeriesData;
      }
    });

    const combinedData = temperatureData.map((tempEntry) => {
      // Find the corresponding cloud cover entry
      const cloudcoverEntry = totalcloudcoverData.find(
        (cloudEntry) => cloudEntry.time === tempEntry.time,
      );

      const precipitationEntry = precipitationAmountData.find(
        (precipitationEntry) => precipitationEntry.time === tempEntry.time,
      );

      return {
        time: tempEntry.time,
        temperature: tempEntry.value ? tempEntry.value : 0,
        cloudcover: cloudcoverEntry
          ? Math.min(cloudcoverEntry.value, 8) * 12.5
          : 0, // Cap at 8 to prevent overflow
        precipitation: precipitationEntry ? precipitationEntry.value : 0,
      };
    });

    return combinedData;
  } catch (error) {
    console.error("Error fetching or processing data:", error);
    throw error;
  }
};
