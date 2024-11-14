interface VisitorDataRow {
  day: string;
  service_group_id: string;
  quantity: string;
  unique_accounts_quantity: string;
}

interface EnkoraVisitorData {
  validations: {
    rows: VisitorDataRow[];
  };
}

interface FormattedVisitorData {
  date: string;
  kulkulupa: number;
  ilmaiskavijat: number;
  paasyliput: number;
  kampanjakavijat: number;
  verkkokauppa: number;
  vuosiliput: number;
  [key: string]: number | string; // Add this line to allow dynamic indexing
}

const idMap: { [key: string]: string } = {
  "2": "kulkulupa",
  "3": "ilmaiskavijat",
  "5": "paasyliput",
  "7": "kampanjakavijat",
  "18": "verkkokauppa",
  "19": "vuosiliput",
};

export default function processEnkoraVisitorData(
  visitorData: EnkoraVisitorData,
) {
  const output: FormattedVisitorData[] = [];

  visitorData.validations.rows.forEach((row) => {
    const { day, service_group_id, quantity } = row;

    // Find or create an entry for the date with default values set to 0
    let entry = output.find((e) => e.date === day);
    if (!entry) {
      entry = {
        date: day,
        kulkulupa: 0,
        ilmaiskavijat: 0,
        paasyliput: 0,
        kampanjakavijat: 0,
        verkkokauppa: 0,
        vuosiliput: 0,
      };
      output.push(entry);
    }

    // Map the service_group_id to the name using idMap
    const serviceGroupName =
      idMap[service_group_id.toString()] || `service_group_${service_group_id}`;

    // Safely convert to number before adding
    entry[serviceGroupName] =
      (typeof entry[serviceGroupName] === "number"
        ? entry[serviceGroupName]
        : 0) + parseInt(quantity);
  });

  return output as FormattedVisitorData[];
}
