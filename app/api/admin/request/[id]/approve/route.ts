import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/request/[id]/approve">
) {
  try {
    const { id } = await ctx.params;

    const request = await prisma.request.update({
      where: { id },
      data: { status: "approved" },
      include: {
        requestor: { select: { id: true, email: true, name: true } },
      },
    });

    return NextResponse.json(request, { status: 200 });
  } catch (err) {
    console.error("Approve error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
