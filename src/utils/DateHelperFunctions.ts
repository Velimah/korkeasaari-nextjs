// Function to generate a range of dates missing in database
export const getMissingDates = (
  start: string,
  end: string,
  existingDates: string[],
) => {
  const missingDates: string[] = [];
  let startDateObj = new Date(start);
  const endDateObj = new Date(end);

  while (startDateObj <= endDateObj) {
    const currentDate = startDateObj.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    if (!existingDates.includes(currentDate)) {
      missingDates.push(currentDate);
    }
    startDateObj.setDate(startDateObj.getDate() + 1); // Move to the next day
  }
  // Return an array of missing dates
  return missingDates;
};

// Helper function to calculate days ahead
export function getDaysAhead(targetDate: string): number {
  const target = new Date(targetDate);
  const today = new Date();

  // Clear time components for an accurate day difference
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
}
