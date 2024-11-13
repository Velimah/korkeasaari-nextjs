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
