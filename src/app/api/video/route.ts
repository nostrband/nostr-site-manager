import { NextResponse } from "next/server";
import fetch from "node-fetch";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    const data = await response.arrayBuffer();

    const headers = new Headers();
    if (url.endsWith(".webm")) {
      headers.set("Content-Type", "video/webm");
    } else if (url.endsWith(".ogg")) {
      headers.set("Content-Type", "video/ogg");
    } else {
      headers.set("Content-Type", "video/mp4");
    }

    headers.set("Content-Length", response.headers.get("Content-Length") || "");

    return new NextResponse(data, {
      headers,
    });
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}
