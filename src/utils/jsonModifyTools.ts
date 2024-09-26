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
  */