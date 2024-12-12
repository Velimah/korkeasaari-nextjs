export interface BLOB {
  date: string;
  temperature: number | null;
  precipitation: number | null;
  cloudcover: number | null;
  kulkulupa: number | null;
  ilmaiskavijat: number | null;
  paasyliput: number | null;
  kampanjakavijat: number | null;
  verkkokauppa: number | null;
  vuosiliput: number | null;
  totalvisitors: number | null;
}

export async function getBLOBData(): Promise<BLOB[] | { error: string }> {
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
