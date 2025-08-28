import deposit from "@/fetchers/ssm/deposit";
import sendTransaction from "@/fetchers/ssm/send-transaction";
import triggerEvent from "@/fetchers/ssm/trigger-event";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { FetchError } from "ofetch";

const allowBonusPoint = ["JFK"];
const BONUS_EVENT_LOOKUP = "JFK_BONUS";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/admin/request/[id]/approve">
) {
  try {
    const { id } = await ctx.params;

    const request = await prisma.request.findUnique({
      where: { id },
      include: { requestor: true },
    });

    if (!request)
      return NextResponse.json({ error: "Request not found" }, { status: 404 });

    if (allowBonusPoint.includes(request.from)) {
      const res = await triggerEvent({
        userId: request.requestor.ssm_id,
        eventLookup: BONUS_EVENT_LOOKUP,
      });
    }

    await sendTransaction({
      request,
    });

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: { status: "approved" },
      include: {
        requestor: { select: { id: true, email: true, name: true } },
      },
    });

    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (err) {
    console.error("Approve error:", err);
    return NextResponse.json(
      { error: (err as FetchError).data },
      { status: 500 }
    );
  }
}
