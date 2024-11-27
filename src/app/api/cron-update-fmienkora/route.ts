import { NextRequest, NextResponse } from "next/server";
import UpdateEnkoraDatabase from "@/utils/UpdateEnkoraDatabase";
import UpdateFMIDatabase from "@/utils/UpdateFMIDatabase";
import UpdateDataBlob from "@/utils/UpdateDataBlob";

export const fetchCache = "force-no-store";

export async function GET(request: NextRequest) {
  try {
    const enkoraUpdateResult = await UpdateEnkoraDatabase();
    const fmiUpdateResult = await UpdateFMIDatabase();

    // Check if both updates failed and return both messages
    if (!enkoraUpdateResult.success && !fmiUpdateResult.success) {
      return NextResponse.json(
        {
          message: `Enkora Update: ${enkoraUpdateResult.message}, FMI Update: ${fmiUpdateResult.message}`,
        },
        {
          status: 400,
        },
      );
    }

    // If both updates were successful, proceed with blob update
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
