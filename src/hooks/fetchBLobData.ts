export interface BLOB {
  date: string; // "2019-01-02"
  temperature: number; // -4.1
  precipitation: number; // 0.3
  cloudcover: number; // 83
  kulkulupa: number; // 0
  ilmaiskavijat: number; // 0
  paasyliput: number; // 171
  kampanjakavijat: number; // 4
  verkkokauppa: number; // 4
  vuosiliput: number; // 25
}

export async function getBLOBData() {
  try {
    const response = await fetch(
      "https://yxkilu3yp1tkxpeo.public.blob.vercel-storage.com/data/mydata.json",
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
