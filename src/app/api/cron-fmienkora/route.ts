import UpdateFMIDatabase from "@/utils/UpdateFMIDatabase";
import UpdateEnkoraDatabase from "@/utils/UpdateEnkoraDatabase";
import UpdateDataBlob from "@/utils/UpdateDataBlob";
import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore } from "next/cache";

export async function GET(request: NextRequest) {
  unstable_noStore(); // Ensure this component is treated as a dynamic component
  try {
    const isFMIUpToDate = await UpdateFMIDatabase();
    const isEnkoraUpToDate = await UpdateEnkoraDatabase();
    if (isFMIUpToDate && isEnkoraUpToDate) {
      console.log("database is up to date");
      return NextResponse.json(
        { response: "database is up to date" },
        { status: 200 },
      );
    }
    await UpdateDataBlob();
    return NextResponse.json({ response: "data updated" }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload data" },
      { status: 500 },
    );
  }
}
