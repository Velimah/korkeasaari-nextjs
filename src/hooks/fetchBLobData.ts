export interface BLOB {
  date: string; // "2019-01-02"
  temperature: number | null; // -4.1
  precipitation: number | null; // 0.3
  cloudcover: number | null; // 83
  kulkulupa: number | null; // 0
  ilmaiskavijat: number | null; // 0
  paasyliput: number | null; // 171
  kampanjakavijat: number | null; // 4
  verkkokauppa: number | null; // 4
  vuosiliput: number | null; // 25
  totalvisitors: number | null; // 204
}

export async function getBLOBData() {
  try {
    const response = await fetch(
      "https://yxkilu3yp1tkxpeo.public.blob.vercel-storage.com/data/mydata.json",
      { cache: "no-store" },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error getting BLOB data:", error);
    return { error: "Failed to get BLOB data" };
  }
}
