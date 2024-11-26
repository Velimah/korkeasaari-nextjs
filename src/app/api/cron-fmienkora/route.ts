import { NextRequest, NextResponse } from "next/server";
import UpdateEnkoraDatabase from "@/utils/UpdateEnkoraDatabase";
import UpdateFMIDatabase from "@/utils/UpdateFMIDatabase";
import UpdateDataBlob from "@/utils/UpdateDataBlob";

export async function GET(request: NextRequest) {
  try {
    await UpdateEnkoraDatabase();
    await UpdateFMIDatabase();
    await UpdateDataBlob();

    return NextResponse.json(
      {
        message: "All updates completed successfully!",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error during updates:", error);

    return NextResponse.json(
      {
        message: "An error occurred during updates.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
