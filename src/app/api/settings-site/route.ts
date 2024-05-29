import { NextRequest, NextResponse } from "next/server";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";

export async function GET(req: NextRequest) {
  const paramsId = req.nextUrl.searchParams.get("id");

  const settings: ReturnSettingsSiteDataType[] = Array.from(
    { length: 5 },
    (_, i) => {
      const id = i + 10;

      return {
        id: `${id}`,
        title: `Site ${id}`,
        description: `Some description about site ${id}`,
        timezone: {
          name: "Europe/Moscow",
          label: "(GMT +3:00) Moscow, St. Petersburg, Volgograd",
        },
        language: "en",
        metaTitle: `Meta ttile ${id}`,
        metaDescription: `Some meta description about site ${id}`,
        xTitle: "",
        xDescription: "",
        fTitle: "",
        fDescription: "",
        socialAccountFaceBook: "https://www.facebook.com/nostr-blog",
        socialAccountX: "https://twitter.com/nostr-blog",
        isPrivate: false,
        password: "",
      };
    },
  );

  await new Promise((resolve) => setTimeout(resolve, 100));

  const setting = settings.find((el) => el.id === paramsId);

  return NextResponse.json(setting, { status: 200 });
}
