import retrieveDetailProfile from "@/fetchers/ssm/retrieve-detail-profile";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // lấy user từ DB
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      ssm_id: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const detailProfile = await retrieveDetailProfile(user.ssm_id);

  return NextResponse.json({ profile: detailProfile });
}
