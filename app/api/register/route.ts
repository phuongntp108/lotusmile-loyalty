import { SSM_API_KEY, SSM_API_SECRET, SSM_ENDPOINT } from "@/constants/envs";
import retrieveDetailProfile from "@/fetchers/ssm/retrieve-detail-profile";
import { issueToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { RegisterUser } from "@/types";
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
    const body = (await req.json()) as RegisterUser;
    const endpoint = `${SSM_ENDPOINT}/priv/v1/apps/${SSM_API_KEY}/users`;

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const userId = uuidv4();

    const auth = Buffer.from(`${SSM_API_KEY}:${SSM_API_SECRET}`).toString(
      "base64"
    );

    const apiParams: SsmUseRegisterAPIParams = {
      user: {
        external_id: userId,
        external_id_type: "merchant_identifier",
        opted_in: "true",
        ...body,
      },
    };

    let createdUserRes;
    try {
      createdUserRes = await ofetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: apiParams,
      });
    } catch (error) {
      return NextResponse.json((error as FetchError).data, {
        status: (error as FetchError).status,
      });
    }

    const newUser = await prisma.user.create({
      data: {
        id: userId,
        email: body.email,
        name: `${body.first_name} ${body.last_name}`,
        password: hashedPassword,
        ssm_id: createdUserRes.user.id,
      },
    });

    const detailProfile = await retrieveDetailProfile(
      await createdUserRes.user.id
    );

    const token = await issueToken({
      email: newUser.email,
      userId: newUser.id,
    });

    return NextResponse.json({ data: detailProfile, token }, { status: 201 });
  } catch (err) {
    console.dir(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
