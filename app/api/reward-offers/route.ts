import getRewardOffers from "@/fetchers/ssm/get-reward-offers";
import { NextResponse } from "next/server";
import { FetchError } from "ofetch";

export async function GET(req: Request) {
  try {
    const res = await getRewardOffers();

    return NextResponse.json({ data: res }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: (err as FetchError).data },
      { status: 500 }
    );
  }
}
