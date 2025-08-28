import retrieveDetailProfile from "@/fetchers/ssm/retrieve-detail-profile";
import searchProfile from "@/fetchers/ssm/search-profile";
import { issueToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { LoginUser } from "@/types";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { FetchError } from "ofetch";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginUser;

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate Password
    const isValid = await bcrypt.compare(body.password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    const detailProfile = await retrieveDetailProfile(user.ssm_id);
    const token = await issueToken({ email: user.email, userId: user.id });

    return NextResponse.json({ data: detailProfile, token }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as FetchError).data },
      { status: 500 }
    );
  }
}
