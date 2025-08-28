import {
  SSM_API_KEY,
  SSM_API_SECRET,
  SSM_ENDPOINT,
  SSM_RETAILER_ID,
  SSM_REWARD_STORE_ID,
} from "@/constants/envs";
import moveToDefaultTier from "@/fetchers/ssm/move-to-default-tier";
import redeemOffer from "@/fetchers/ssm/redeem-offer";
import retrieveDetailProfile from "@/fetchers/ssm/retrieve-detail-profile";
import { issueToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { RedeemOfferPayload, RegisterUser } from "@/types";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { FetchError, ofetch } from "ofetch";
import { v4 as uuidv4 } from "uuid";

export interface SsmUseRegisterAPIParams {
  user: {
    opted_in: "true";
    external_id: string;
    external_id_type: "merchant_identifier";
    email: string;
    first_name: string;
    last_name: string;
    gender: string;
    dob: string;
    country: string;
    password: string;
  };
}

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    const body = (await req.json()) as RedeemOfferPayload;

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const res = await redeemOffer({
      rewardStoreOfferId: body.rewardStoreOfferId,
      userId: user?.ssm_id,
    });

    return NextResponse.json({ data: res }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as FetchError).data },
      { status: 500 }
    );
  }
}
