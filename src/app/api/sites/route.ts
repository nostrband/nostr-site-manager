import { NextResponse } from "next/server";
import { ReturnSitesDataType } from "@/services/sites.service";

export async function GET() {
  const data: ReturnSitesDataType[] = Array.from({ length: 5 }, (_, i) => ({
    id: `${i + 10}`,
    title: `Site ${i + 10}`,
  }));

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return NextResponse.json(data, { status: 200 });
}
