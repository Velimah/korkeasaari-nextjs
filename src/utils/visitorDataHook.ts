
// Interface for a day entry
export interface DayEntry {
  day: number;            // Represents the day of the month
  total: number;          // Total value for the day
  id: string;             // Unique identifier for the entry
}
  
// Interface for a month entry
export interface MonthEntry {
  month: number;          // Represents the month (0 for January, 1 for February, etc.)
  total: number;          // Total value for the month
  days: DayEntry[];       // Array of day entries for the month
}
  
// Main interface for the yearly data
export interface YearlyData {
  year: number;           // Represents the year
  total: number;          // Total value for the year
  months: MonthEntry[];  // Array of month entries for the year
}

export const fetchVisitorData = async (): Promise<YearlyData> => {
  try {
      const response = await fetch(
      "https://korkeasaarenkavijat.onrender.com/api/data/year"
      );
  
      if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const visitorData = await response.json();
      return visitorData;
  } catch (error) {
    console.error("Error fetching or processing data:", error);
    throw error;
  }
};